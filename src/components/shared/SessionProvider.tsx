import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useSessionManager } from "@/hooks/data/useSessionManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { /*Clock,*/ AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
interface SessionContextType {
  showPopup: boolean;
  idleTime: number;
  handleRefresh: () => void;
  handleLogout: () => void;
  LOGOUT_TIME: number;
  isLoading: boolean;
}
interface SessionProviderProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContextType | null | undefined>(
  null,
);

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: SessionProviderProps) {
  const {
    showPopup,
    idleTime,
    handleRefresh,
    handleLogout,
    LOGOUT_TIME,
    isLoading,
  } = useSessionManager();
  const value = useMemo(
    () => ({
      showPopup,
      idleTime,
      handleRefresh,
      handleLogout,
      LOGOUT_TIME,
      isLoading,
    }),
    [showPopup, idleTime, handleRefresh, handleLogout, LOGOUT_TIME, isLoading],
  );
  return (
    <SessionContext.Provider value={value}>
      {children}
      <SessionDialog
        open={showPopup}
        idleTime={idleTime}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        LOGOUT_TIME={LOGOUT_TIME}
        isLoading={isLoading}
      />
    </SessionContext.Provider>
  );
}

interface SessionRefreshDialogProps {
  open: boolean;
  idleTime: number; // ms
  onRefresh: () => void;
  onLogout: () => void;
  LOGOUT_TIME: number; //ms
  isLoading: boolean;
}

function SessionDialog({
  open,
  idleTime,
  onRefresh,
  onLogout,
  LOGOUT_TIME,
  isLoading,
}: SessionRefreshDialogProps) {
  const [t] = useTranslation("global");

  if (!open) return null;

  // ⏳ remaining = 15min - idle
  const remaining = useMemo(() => {
    if (LOGOUT_TIME !== undefined && idleTime !== undefined) {
      return Math.max(0, LOGOUT_TIME - idleTime);
    }
    return 0;
  }, [LOGOUT_TIME, idleTime]);
  const totalSeconds = useMemo(() => {
    return Math.floor(remaining / 1000);
  }, [remaining]);
  const minutes = useMemo(() => {
    return Math.floor(totalSeconds / 60);
  }, [totalSeconds]);
  const seconds = useMemo(() => {
    return totalSeconds % 60;
  }, [totalSeconds]);

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-semibold">
            {t("common.messages.sessionExpiredTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("common.messages.sessionExpiredBody")}{" "}
            <b>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t("common.messages.sessionLogout")}
          </Button>

          <Button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t("common.messages.sessionExtendAction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
