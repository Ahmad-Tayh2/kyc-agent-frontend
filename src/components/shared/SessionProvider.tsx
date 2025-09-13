import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useSessionManager } from "@/hooks/data/useSessionManager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";

interface SessionRefreshDialogProps {
  showInactivityDialog: boolean;
  showActivityDialog: boolean;
  showExpirationWarning: boolean;
  onInactivityChoice: (extendSession: boolean) => void;
  onActivityChoice: (extendSession: boolean) => void;
  onExpirationChoice: (extendSession: boolean) => void;
  isLoading: boolean;
}

interface SessionContextType {
  isActive: boolean;
  lastActivity: number;
  handleRefreshToken: () => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const {
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
    isLoading,
  } = useSessionManager();

  const contextValue: SessionContextType = {
    isActive,
    lastActivity,
    handleRefreshToken,
    handleLogout,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
      <SessionRefreshDialog
        showInactivityDialog={showInactivityDialog}
        showActivityDialog={showActivityDialog}
        showExpirationWarning={showExpirationWarning}
        onInactivityChoice={handleInactivityChoice}
        onActivityChoice={handleActivityChoice}
        onExpirationChoice={handleExpirationChoice}
        isLoading={isLoading}
      />
    </SessionContext.Provider>
  );
}

function SessionRefreshDialog({
  showInactivityDialog,
  showActivityDialog,
  showExpirationWarning,
  onInactivityChoice,
  onActivityChoice,
  onExpirationChoice,
  isLoading,
}: SessionRefreshDialogProps) {
  const isOpen = showInactivityDialog || showExpirationWarning;

  const handleChoice = (extendSession: boolean) => {
    if (showInactivityDialog) {
      onInactivityChoice(extendSession);
    } else if (showActivityDialog) {
      onActivityChoice(extendSession);
    } else if (showExpirationWarning) {
      onExpirationChoice(extendSession);
    }
  };

  const getDialogContent = () => {
    if (showInactivityDialog) {
      return {
        title: "Session Timeout",
        description:
          "Your session has been inactive for a while. Would you like to extend your session to continue working?",
        icon: <Clock className="h-6 w-6 text-amber-500" />,
        primaryButton: "Extend Session",
        secondaryButton: "Logout",
        onPrimaryClick: () => handleChoice(true),
        onSecondaryClick: () => handleChoice(false),
      };
    }

    if (showActivityDialog) {
      return {
        title: "Session Timeout",
        description:
          "Would you like to extend your session to continue working?",
        icon: <Clock className="h-6 w-6 text-amber-500" />,
        primaryButton: "Extend Session",
        secondaryButton: "Logout",
        onPrimaryClick: () => handleChoice(true),
        onSecondaryClick: () => handleChoice(false),
      };
    }

    if (showExpirationWarning) {
      return {
        title: "Session Expiring Soon",
        description:
          'Your session will expire in 5 minutes. If you wish to stay logged in, click "Extend Session".',
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
        primaryButton: "Extend Session",
        secondaryButton: null,
        onPrimaryClick: () => handleChoice(true),
        onSecondaryClick: null,
      };
    }

    return null;
  };

  const content = getDialogContent();
  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
            {content.icon}
          </div>
          <DialogTitle className="text-lg font-semibold">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={content.onPrimaryClick}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : content.primaryButton}
          </Button>

          {content.secondaryButton && (
            <Button
              variant="outline"
              onClick={content.onSecondaryClick}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {content.secondaryButton}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
