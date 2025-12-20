// import { useEffect, useRef, useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRefreshToken, useLogout } from "@/hooks/data/useAuth";
// import { tokenManager } from "@/lib/utils";

// interface SessionConfig {
//   inactivityTimeout: number; // 10 minutes in milliseconds
//   activeRefreshInterval: number; // 15 minutes in milliseconds
//   expirationWarningTime: number; // 5 minutes in milliseconds
// }

// const DEFAULT_CONFIG: SessionConfig = {
//   inactivityTimeout: 10 * 60 * 1000, // 10 minutes
//   activeRefreshInterval: 15 * 60 * 1000, // 15 minutes
//   expirationWarningTime: 5 * 60 * 1000, // 5 minutes
// };

// export function useSessionManager(config: Partial<SessionConfig> = {}) {
//   const mergedConfig = { ...DEFAULT_CONFIG, ...config };
//   const navigate = useNavigate();
//   const refreshTokenMutation = useRefreshToken();
//   const logoutMutation = useLogout();

//   const [showInactivityDialog, setShowInactivityDialog] = useState(false);
//   const [showActivityDialog, setShowActivityDialog] = useState(false);
//   const [showExpirationWarning, setShowExpirationWarning] = useState(false);
//   const [lastActivity, setLastActivity] = useState(Date.now());
//   const [isActive, setIsActive] = useState(true);

//   const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const activeRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const expirationWarningTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const tokenExpirationTimeRef = useRef<number | null>(null);

//   // Update last activity timestamp
//   const updateActivity = useCallback(() => {
//     setLastActivity(Date.now());
//     setIsActive(true);
//   }, []);

//   // Reset timers
//   const resetTimers = useCallback(() => {
//     // Clear existing timers
//     if (inactivityTimerRef.current) {
//       clearTimeout(inactivityTimerRef.current);
//     }
//     if (activeRefreshTimerRef.current) {
//       clearTimeout(activeRefreshTimerRef.current);
//     }
//     if (expirationWarningTimerRef.current) {
//       clearTimeout(expirationWarningTimerRef.current);
//     }

//     // Set inactivity timer
//     inactivityTimerRef.current = setTimeout(() => {
//       setShowInactivityDialog(true);
//       setIsActive(false);
//     }, mergedConfig.inactivityTimeout);

//     // Set active refresh timer
//     activeRefreshTimerRef.current = setTimeout(() => {
//       if (isActive) {
//         setShowActivityDialog(true);
//       }
//     }, mergedConfig.activeRefreshInterval);

//     // Set expiration warning timer
//     if (tokenExpirationTimeRef.current) {
//       const timeUntilWarning =
//         tokenExpirationTimeRef.current -
//         Date.now() -
//         mergedConfig.expirationWarningTime;
//       if (timeUntilWarning > 0) {
//         expirationWarningTimerRef.current = setTimeout(() => {
//           setShowExpirationWarning(true);
//         }, timeUntilWarning);
//       }
//     }
//   }, [mergedConfig, isActive]);

//   // Handle token refresh
//   const handleRefreshToken = useCallback(async () => {
//     try {
//       const response = await refreshTokenMutation.mutateAsync();
//       if (response.access_token) {
//         // Update token in localStorage
//         tokenManager.setToken(response.access_token);

//         // Update user data
//         localStorage.setItem("user", JSON.stringify(response.user));

//         // Calculate new expiration time
//         tokenExpirationTimeRef.current =
//           Date.now() + response.expires_in * 1000;

//         // Reset timers with new expiration
//         resetTimers();

//         // Close dialogs
//         setShowInactivityDialog(false);
//         setShowExpirationWarning(false);

//         return true;
//       }
//     } catch (error) {
//       console.error("Failed to refresh token:", error);
//       // If refresh fails, logout user
//       await handleLogout();

//       return false;
//     }
//     return false;
//   }, [refreshTokenMutation, resetTimers]);

//   // Handle logout
//   const handleLogout = useCallback(async () => {
//     try {
//       await logoutMutation.mutateAsync();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       // Clear all timers
//       if (inactivityTimerRef.current) {
//         clearTimeout(inactivityTimerRef.current);
//         setShowInactivityDialog(false);
//       }
//       if (activeRefreshTimerRef.current) {
//         clearTimeout(activeRefreshTimerRef.current);
//       }
//       if (expirationWarningTimerRef.current) {
//         clearTimeout(expirationWarningTimerRef.current);
//         setShowExpirationWarning(false);
//       }
//     }
//   }, [logoutMutation, navigate]);

//   // Handle inactivity dialog choice
//   const handleInactivityChoice = useCallback(
//     async (extendSession: boolean) => {
//       if (extendSession) {
//         const success = await handleRefreshToken();
//         if (!success) {
//           await handleLogout();
//         }
//       } else {
//         await handleLogout();
//       }
//     },
//     [handleRefreshToken, handleLogout]
//   );

//   // Handle inactivity dialog choice
//   const handleActivityChoice = useCallback(
//     async (extendSession: boolean) => {
//       if (extendSession) {
//         const success = await handleRefreshToken();
//         if (!success) {
//           await handleLogout();
//         }
//       } else {
//         await handleLogout();
//       }
//     },
//     [handleRefreshToken, handleLogout]
//   );

//   // Handle expiration warning choice
//   const handleExpirationChoice = useCallback(
//     async (extendSession: boolean) => {
//       if (extendSession) {
//         const success = await handleRefreshToken();
//         if (!success) {
//           await handleLogout();
//         }
//       } else {
//         // Wait for token to expire and then logout
//         if (tokenExpirationTimeRef.current) {
//           const timeUntilExpiration =
//             tokenExpirationTimeRef.current - Date.now();
//           if (timeUntilExpiration > 0) {
//             setTimeout(() => {
//               handleLogout();
//             }, timeUntilExpiration);
//           } else {
//             handleLogout();
//           }
//         }
//       }
//     },
//     [handleRefreshToken, handleLogout]
//   );

//   // Initialize session management
//   useEffect(() => {
//     // Get current token and calculate expiration
//     const token = tokenManager.getToken();
//     if (token) {
//       // Try to get expiration from localStorage or assume 1 hour
//       const storedExpiration = localStorage.getItem("tokenExpiration");
//       let expiresIn = 3600; // Default 1 hour

//       if (storedExpiration) {
//         try {
//           const expirationTime = parseInt(storedExpiration, 10);
//           if (expirationTime > Date.now()) {
//             tokenExpirationTimeRef.current = expirationTime;
//           } else {
//             // Token has expired, clear storage
//             // localStorage.removeItem("token");
//             // localStorage.removeItem("user");
//             return;
//           }
//         } catch (error) {
//           console.error("Error parsing token expiration:", error);
//           // Fallback to default expiration
//           tokenExpirationTimeRef.current = Date.now() + expiresIn * 1000;
//         }
//       } else {
//         // No stored expiration, assume 1 hour from now
//         tokenExpirationTimeRef.current = Date.now() + expiresIn * 1000;
//       }

//       // Set up activity listeners
//       const events = [
//         "mousedown",
//         "mousemove",
//         "keypress",
//         "scroll",
//         "touchstart",
//         "click",
//       ];
//       events.forEach((event) => {
//         document.addEventListener(event, updateActivity, true);
//       });

//       // Set up timers
//       resetTimers();

//       // Cleanup function
//       return () => {
//         events.forEach((event) => {
//           document.removeEventListener(event, updateActivity, true);
//         });

//         if (inactivityTimerRef.current) {
//           clearTimeout(inactivityTimerRef.current);
//         }
//         if (activeRefreshTimerRef.current) {
//           clearTimeout(activeRefreshTimerRef.current);
//         }
//         if (expirationWarningTimerRef.current) {
//           clearTimeout(expirationWarningTimerRef.current);
//         }
//       };
//     }
//   }, [updateActivity, resetTimers, handleLogout]);

//   // Reset timers when activity changes
//   useEffect(() => {
//     if (tokenManager.hasToken()) {
//       resetTimers();
//     }
//   }, [lastActivity, resetTimers]);

//   return {
//     showInactivityDialog,
//     showActivityDialog,
//     showExpirationWarning,
//     isActive,
//     lastActivity,
//     handleRefreshToken,
//     handleLogout,
//     handleInactivityChoice,
//     handleActivityChoice,
//     handleExpirationChoice,
//     isLoading: refreshTokenMutation.isPending || logoutMutation.isPending,
//   };
// }

// import { useEffect, useRef, useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRefreshToken, useLogout } from "@/hooks/data/useAuth";
// import { tokenManager } from "@/lib/utils";
// import { useAuthStore } from "@/store/authStore";

// export function useSessionManager() {
//   const navigate = useNavigate();
//   const refreshTokenMutation = useRefreshToken();
//   const logoutMutation = useLogout();
//   const { login: loginInStore } = useAuthStore();

//   const [showExpirationWarning, setShowExpirationWarning] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [isActive, setIsActive] = useState(true);
//   const [lastActivity, setLastActivity] = useState(Date.now());

//   const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const tokenExpirationTimeRef = useRef<number | null>(null);

//   // Detect user activity
//   const updateActivity = useCallback(() => {
//     setLastActivity(Date.now());
//     setIsActive(true);
//   }, []);

//   // 🔁 Refresh token handler
//   const handleRefreshToken = useCallback(async () => {
//     try {
//       const response = await refreshTokenMutation.mutateAsync();
//       if (response.access_token) {
//         tokenManager.setToken(response.access_token);
//         localStorage.setItem("user", JSON.stringify(response.user));
//         loginInStore(response.user, response.access_token, response.expires_in); //save the auth data in zustand store
//         tokenExpirationTimeRef.current =
//           Date.now() + response.expires_in * 1000;

//         // Reset timers with new expiration
//         scheduleTimers();

//         setShowExpirationWarning(false);
//         return true;
//       }
//     } catch (error) {
//       console.error("Token refresh failed:", error);
//       await handleLogout();
//     }
//     return false;
//   }, [refreshTokenMutation]);

//   // 🚪 Logout handler
//   const handleLogout = useCallback(async () => {
//     try {
//       await logoutMutation.mutateAsync();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       clearAllTimers();
//       // tokenManager.clearToken?.();
//       console.log(" should logout here");
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   }, [logoutMutation, navigate]);

//   // 🧹 Clear timers
//   const clearAllTimers = useCallback(() => {
//     if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
//     if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
//     if (countdownIntervalRef.current)
//       clearInterval(countdownIntervalRef.current);
//   }, []);

//   // 🕓 Schedule refresh + warning timers
//   const scheduleTimers = useCallback(() => {
//     clearAllTimers();

//     if (!tokenExpirationTimeRef.current) return;

//     const timeUntilExpiration = tokenExpirationTimeRef.current - Date.now();

//     // Time before auto-refresh (1 minute before expiration)
//     const autoRefreshAt = timeUntilExpiration - 60 * 1000;

//     // Time before warning (5 minutes before expiration)
//     const warningAt = timeUntilExpiration - 5 * 60 * 1000;

//     if (isActive) {
//       // Auto refresh 1 minute before expiration
//       if (autoRefreshAt > 0) {
//         refreshTimerRef.current = setTimeout(() => {
//           handleRefreshToken();
//         }, autoRefreshAt);
//       }
//     } else {
//       // Show dialog 5 minutes before expiration
//       if (warningAt > 0) {
//         warningTimerRef.current = setTimeout(() => {
//           setShowExpirationWarning(true);
//           startCountdown();
//         }, warningAt);
//       }
//     }
//   }, [isActive, handleRefreshToken, clearAllTimers]);

//   // ⏳ Countdown logic (minutes:seconds)
//   const startCountdown = useCallback(() => {
//     if (!tokenExpirationTimeRef.current) return;

//     const updateCountdown = () => {
//       const remaining = Math.max(
//         0,
//         tokenExpirationTimeRef.current! - Date.now()
//       );
//       setCountdown(remaining);

//       if (remaining <= 0) {
//         clearInterval(countdownIntervalRef.current!);
//         handleLogout();
//       }
//     };

//     updateCountdown();
//     countdownIntervalRef.current = setInterval(updateCountdown, 1000);
//   }, [handleLogout]);

//   // 🧠 Initialize session
//   useEffect(() => {
//     const token = tokenManager.getToken();
//     if (!token) return;

//     const storedExpiration = localStorage.getItem("expires_in");
//     let expiresIn = 3600; // fallback = 1h
//     if (storedExpiration) {
//       const exp = parseInt(storedExpiration, 10);
//       tokenExpirationTimeRef.current = exp;
//     } else {
//       tokenExpirationTimeRef.current = Date.now() + expiresIn * 1000;
//     }

//     const events = [
//       "mousedown",
//       "mousemove",
//       "keypress",
//       "scroll",
//       "touchstart",
//       "click",
//     ];
//     events.forEach((ev) => document.addEventListener(ev, updateActivity));

//     scheduleTimers();

//     return () => {
//       events.forEach((ev) => document.removeEventListener(ev, updateActivity));
//       clearAllTimers();
//     };
//   }, [updateActivity, scheduleTimers, clearAllTimers]);

//   return {
//     showExpirationWarning,
//     countdown, // expose countdown in ms
//     isActive,
//     lastActivity,
//     handleRefreshToken,
//     handleLogout,
//     isLoading: refreshTokenMutation.isPending || logoutMutation.isPending,
//   };
// }

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tokenManager } from "@/lib/utils";
import { useLogout, useRefreshToken } from "@/hooks/data/useAuth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export function useSessionManager() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { login: loginInStore, user, logout: logoutFromStore } = useAuthStore();
  const refreshTokenMutation = useRefreshToken();
  // UI States
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [countdown, setCountdown] = useState(0); // in ms
  const [isUserActive, setIsUserActive] = useState(true);
  // Refs to hold latest values for interval closure
  const showExpirationWarningRef = useRef(showExpirationWarning);
  const isUserActiveRef = useRef(isUserActive);

  // Sync refs when state changes
  useEffect(() => {
    showExpirationWarningRef.current = showExpirationWarning;
  }, [showExpirationWarning]);

  useEffect(() => {
    isUserActiveRef.current = isUserActive;
  }, [isUserActive]);
  // Internal tracking
  const lastActivityRef = useRef(Date.now());
  const expirationTimeRef = useRef<number | null>(null);
  const countdownIntervalRef: any = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
  // const INACTIVITY_LIMIT = 10 * 1000; // 10 seconds
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  // const WARNING_THRESHOLD = 90 * 1000; // 2 minutes

  // ---------------------------------------------------------------
  // 🔹 USER ACTIVITY DETECTION
  // ---------------------------------------------------------------
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsUserActive(true);
  }, []);

  // ---------------------------------------------------------------
  // 🔹 LOGOUT
  // ---------------------------------------------------------------
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      logoutFromStore();
      navigate(ROUTES.AUTH.LOGIN);
      localStorage.removeItem("user");
      setShowExpirationWarning(false);
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Cleanup
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, [logoutMutation]);

  // ---------------------------------------------------------------
  // 🔹 LOAD EXPIRATION FROM LOCAL STORAGE
  // ---------------------------------------------------------------
  const loadExpirationFromStorage = useCallback(() => {
    const expiresInStr = localStorage.getItem("expires_in");
    if (!expiresInStr) return;

    const expiresIn = parseInt(expiresInStr, 10);
    if (isNaN(expiresIn)) return;

    expirationTimeRef.current = Date.now() + expiresIn * 1000;
  }, []);

  // ---------------------------------------------------------------
  // 🔹 COUNTDOWN CALCULATION
  // ---------------------------------------------------------------
  const startCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      if (!expirationTimeRef.current) return;
      const remaining = Math.max(0, expirationTimeRef.current - Date.now());

      setCountdown(remaining);

      // Use latest values from refs
      const currentlyInactive =
        Date.now() - lastActivityRef.current >= INACTIVITY_LIMIT;

      // If expired → logout or refresh logic
      if (remaining <= 30000) {
        // If user active → auto-refresh
        if (isUserActiveRef.current && !showExpirationWarningRef.current) {
          handleRefreshToken();
          return;
        }
        // Inactive → logout
        clearInterval(countdownIntervalRef.current);
        setShowExpirationWarning(false);
        handleLogout();
        return;
      }

      // Show warning only if user is INACTIVE and remaining time is between threshold and 30s
      if (
        currentlyInactive &&
        remaining <= WARNING_THRESHOLD &&
        remaining > 30000
      ) {
        setShowExpirationWarning(true);
      }

      // Update inactivity state based on last activity
      const inactiveFor = Date.now() - lastActivityRef.current;
      setIsUserActive(inactiveFor < INACTIVITY_LIMIT);
    }, 1000);
  };

  // ---------------------------------------------------------------
  // 🔹 TRACK LOCAL STORAGE CHANGES (new token)
  // ---------------------------------------------------------------
  useEffect(() => {
    let lastExpiresIn = localStorage.getItem("expires_in");

    const interval = setInterval(() => {
      const currentExpiresIn = localStorage.getItem("expires_in");

      if (currentExpiresIn !== lastExpiresIn) {
        lastExpiresIn = currentExpiresIn;

        // Refresh expiration logic
        loadExpirationFromStorage();
        startCountdown();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loadExpirationFromStorage, startCountdown]);

  // Also listen to storage events (for other tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "expires_in") {
        loadExpirationFromStorage();
        startCountdown();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [loadExpirationFromStorage, startCountdown]);

  // ---------------------------------------------------------------
  // 🔹 INITIALIZE
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!user) return; // do nothing when logged out

    loadExpirationFromStorage();
    startCountdown();

    const events = [
      "mousemove",
      "mousedown",
      "scroll",
      "keypress",
      "touchstart",
      "click",
    ];
    events.forEach((ev) => document.addEventListener(ev, updateActivity));

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, updateActivity));
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [user]); // 👈 re-run when user logs in

  // ---------------------------------------------------------------
  // 🔹 REFRESH TOKEN
  // ---------------------------------------------------------------

  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await refreshTokenMutation.mutateAsync();
      if (response.access_token) {
        tokenManager.setToken(response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        loginInStore(
          response.user,
          response.access_token,
          "900" /*response.expires_in*/
        ); //save the auth data in zustand store
        console.log("refresh ressss = = ", response);
        // ✔ Update expires_in based on API response
        if (response?.expires_in) {
          localStorage.setItem(
            "expires_in",
            String("900" /*response.expires_in*/)
          );
        }

        // ✔ Update token if API returns a new one
        if (response?.access_token) {
          tokenManager.setToken(response.access_token);
        }

        // ✔ Restart the timers & countdown
        loadExpirationFromStorage();
        startCountdown();
        setShowExpirationWarning(false);

        // tokenExpirationTimeRef.current =
        //   Date.now() + response.expires_in * 1000;

        // // Reset timers with new expiration
        // scheduleTimers();

        setShowExpirationWarning(false);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await handleLogout();
    }
    return false;
  }, [refreshTokenMutation]);
  // ---------------------------------------------------------------
  // 🔹 RETURN VALUES
  // ---------------------------------------------------------------
  return {
    showExpirationWarning,
    countdown,
    isUserActive,
    handleLogout,
    handleRefreshToken,
    isLoading: false,
  };
}
