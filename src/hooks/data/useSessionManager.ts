import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout, useRefreshToken } from "@/hooks/data/useAuth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";
import { tokenManager } from "@/lib/utils";
//Shared localStorage keys
const LS_KEYS = {
  LAST_ACTIVITY: "lastActivityTimestamp",
  LAST_REFRESH: "lastRefreshTimestamp",
  LOGOUT: "forceLogout",
};

export function useSessionManager() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const refreshMutation = useRefreshToken();
  const { login, logout } = useAuthStore();

  const [showPopup, setShowPopup] = useState(false);
  const [idleTime, setIdleTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //CONFIG
  const REFRESH_INTERVAL = 1 * 60 * 1000;
  const POPUP_TIME = 2 * 60 * 1000;
  const LOGOUT_TIME = 3 * 60 * 1000;

  // --------------------------------------------------
  // ACTIVITY
  // --------------------------------------------------
  const updateActivity = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(LS_KEYS.LAST_ACTIVITY, String(now));
  }, []);

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {}

    localStorage.setItem(LS_KEYS.LOGOUT, String(Date.now()));
    localStorage.removeItem("user");
    tokenManager.removeToken();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    logout();
    navigate(ROUTES.AUTH.LOGIN);
    setShowPopup(false);
  }, []);

  // --------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------
  const handleRefresh = useCallback(async () => {
    try {
      const res = await refreshMutation.mutateAsync();

      if (res?.access_token) {
        login(res.user, res.access_token, res.expires_in);
        tokenManager.setToken(res.access_token);
        localStorage.setItem(LS_KEYS.LAST_REFRESH, String(Date.now()));
      }
      if (res?.expires_in) {
        localStorage.setItem("expires_in", String(res.expires_in));
      }
      setShowPopup(false);
    } catch (err) {
      handleLogout();
    }
  }, [refreshMutation]);

  // --------------------------------------------------
  // MAIN LOOP
  // --------------------------------------------------
  const startLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    //stop the loop if the user is logged out
    const isLoggedIn = !!localStorage.getItem("user");
    if (!isLoggedIn) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();

      const lastActivity =
        Number(localStorage.getItem(LS_KEYS.LAST_ACTIVITY)) || now;

      const lastRefresh =
        Number(localStorage.getItem(LS_KEYS.LAST_REFRESH)) || now;

      const idle = now - lastActivity;

      setIdleTime(idle);

      // REFRESH LOGIC
      if (now - lastRefresh >= REFRESH_INTERVAL) {
        if (idle < REFRESH_INTERVAL) {
          handleRefresh();
        } else {
          // reset refresh timer only
          localStorage.setItem(LS_KEYS.LAST_REFRESH, String(now));
        }
      }

      //POPUP
      if (idle >= POPUP_TIME && idle < LOGOUT_TIME) {
        setShowPopup(true);
      }

      //AUTO LOGOUT
      if (idle >= LOGOUT_TIME) {
        handleLogout();
      }
    }, 1000);
  };

  // --------------------------------------------------
  // STORAGE SYNC (MULTI TAB)
  // --------------------------------------------------
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LS_KEYS.LOGOUT) {
        logout();
        navigate(ROUTES.AUTH.LOGIN);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // --------------------------------------------------
  // INIT
  // --------------------------------------------------
  useEffect(() => {
    const now = Date.now();

    if (!localStorage.getItem(LS_KEYS.LAST_ACTIVITY)) {
      localStorage.setItem(LS_KEYS.LAST_ACTIVITY, String(now));
    }

    if (!localStorage.getItem(LS_KEYS.LAST_REFRESH)) {
      localStorage.setItem(LS_KEYS.LAST_REFRESH, String(now));
    }

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((e) => document.addEventListener(e, updateActivity));

    startLoop();

    return () => {
      events.forEach((e) => document.removeEventListener(e, updateActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [localStorage.getItem("user")]);

  return {
    showPopup,
    idleTime,
    handleRefresh,
    handleLogout,
    LOGOUT_TIME,
    isLoading: refreshMutation.isPending || logoutMutation.isPending,
  };
}
