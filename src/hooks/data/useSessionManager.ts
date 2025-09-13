import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefreshToken, useLogout } from "@/hooks/data/useAuth";
import { tokenManager } from "@/lib/utils";

interface SessionConfig {
  inactivityTimeout: number; // 10 minutes in milliseconds
  activeRefreshInterval: number; // 15 minutes in milliseconds
  expirationWarningTime: number; // 5 minutes in milliseconds
}

const DEFAULT_CONFIG: SessionConfig = {
  inactivityTimeout: 10 * 60 * 1000, // 10 minutes
  activeRefreshInterval: 15 * 60 * 1000, // 15 minutes
  expirationWarningTime: 5 * 60 * 1000, // 5 minutes
};

export function useSessionManager(config: Partial<SessionConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const navigate = useNavigate();
  const refreshTokenMutation = useRefreshToken();
  const logoutMutation = useLogout();

  const [showInactivityDialog, setShowInactivityDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isActive, setIsActive] = useState(true);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expirationWarningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenExpirationTimeRef = useRef<number | null>(null);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsActive(true);
  }, []);

  // Reset timers
  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (activeRefreshTimerRef.current) {
      clearTimeout(activeRefreshTimerRef.current);
    }
    if (expirationWarningTimerRef.current) {
      clearTimeout(expirationWarningTimerRef.current);
    }

    // Set inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityDialog(true);
      setIsActive(false);
    }, mergedConfig.inactivityTimeout);

    // Set active refresh timer
    activeRefreshTimerRef.current = setTimeout(() => {
      if (isActive) {
        setShowActivityDialog(true);
      }
    }, mergedConfig.activeRefreshInterval);

    // Set expiration warning timer
    if (tokenExpirationTimeRef.current) {
      const timeUntilWarning =
        tokenExpirationTimeRef.current -
        Date.now() -
        mergedConfig.expirationWarningTime;
      if (timeUntilWarning > 0) {
        expirationWarningTimerRef.current = setTimeout(() => {
          setShowExpirationWarning(true);
        }, timeUntilWarning);
      }
    }
  }, [mergedConfig, isActive]);

  // Handle token refresh
  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await refreshTokenMutation.mutateAsync();
      if (response.access_token) {
        // Update token in localStorage
        tokenManager.setToken(response.access_token);

        // Update user data
        localStorage.setItem("user", JSON.stringify(response.user));

        // Calculate new expiration time
        tokenExpirationTimeRef.current =
          Date.now() + response.expires_in * 1000;

        // Reset timers with new expiration
        resetTimers();

        // Close dialogs
        setShowInactivityDialog(false);
        setShowExpirationWarning(false);

        return true;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If refresh fails, logout user
      await handleLogout();

      return false;
    }
    return false;
  }, [refreshTokenMutation, resetTimers]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        setShowInactivityDialog(false);
      }
      if (activeRefreshTimerRef.current) {
        clearTimeout(activeRefreshTimerRef.current);
      }
      if (expirationWarningTimerRef.current) {
        clearTimeout(expirationWarningTimerRef.current);
        setShowExpirationWarning(false);
      }
    }
  }, [logoutMutation, navigate]);

  // Handle inactivity dialog choice
  const handleInactivityChoice = useCallback(
    async (extendSession: boolean) => {
      if (extendSession) {
        const success = await handleRefreshToken();
        if (!success) {
          await handleLogout();
        }
      } else {
        await handleLogout();
      }
    },
    [handleRefreshToken, handleLogout]
  );

  // Handle inactivity dialog choice
  const handleActivityChoice = useCallback(
    async (extendSession: boolean) => {
      if (extendSession) {
        const success = await handleRefreshToken();
        if (!success) {
          await handleLogout();
        }
      } else {
        await handleLogout();
      }
    },
    [handleRefreshToken, handleLogout]
  );

  // Handle expiration warning choice
  const handleExpirationChoice = useCallback(
    async (extendSession: boolean) => {
      if (extendSession) {
        const success = await handleRefreshToken();
        if (!success) {
          await handleLogout();
        }
      } else {
        // Wait for token to expire and then logout
        if (tokenExpirationTimeRef.current) {
          const timeUntilExpiration =
            tokenExpirationTimeRef.current - Date.now();
          if (timeUntilExpiration > 0) {
            setTimeout(() => {
              handleLogout();
            }, timeUntilExpiration);
          } else {
            handleLogout();
          }
        }
      }
    },
    [handleRefreshToken, handleLogout]
  );

  // Initialize session management
  useEffect(() => {
    // Get current token and calculate expiration
    const token = tokenManager.getToken();
    if (token) {
      // Try to get expiration from localStorage or assume 1 hour
      const storedExpiration = localStorage.getItem("tokenExpiration");
      let expiresIn = 3600; // Default 1 hour

      if (storedExpiration) {
        try {
          const expirationTime = parseInt(storedExpiration, 10);
          if (expirationTime > Date.now()) {
            tokenExpirationTimeRef.current = expirationTime;
          } else {
            // Token has expired, logout user
            handleLogout();
            return;
          }
        } catch (error) {
          console.error("Error parsing token expiration:", error);
          // Fallback to default expiration
          tokenExpirationTimeRef.current = Date.now() + expiresIn * 1000;
        }
      } else {
        // No stored expiration, assume 1 hour from now
        tokenExpirationTimeRef.current = Date.now() + expiresIn * 1000;
      }

      // Set up activity listeners
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
        "click",
      ];
      events.forEach((event) => {
        document.addEventListener(event, updateActivity, true);
      });

      // Set up timers
      resetTimers();

      // Cleanup function
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, updateActivity, true);
        });

        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        if (activeRefreshTimerRef.current) {
          clearTimeout(activeRefreshTimerRef.current);
        }
        if (expirationWarningTimerRef.current) {
          clearTimeout(expirationWarningTimerRef.current);
        }
      };
    }
  }, [updateActivity, resetTimers, handleLogout]);

  // Reset timers when activity changes
  useEffect(() => {
    if (tokenManager.hasToken()) {
      resetTimers();
    }
  }, [lastActivity, resetTimers]);

  return {
    showInactivityDialog,
    showActivityDialog,
    showExpirationWarning,
    isActive,
    lastActivity,
    handleRefreshToken,
    handleLogout,
    handleInactivityChoice,
    handleActivityChoice,
    handleExpirationChoice,
    isLoading: refreshTokenMutation.isPending || logoutMutation.isPending,
  };
}
