import { createContext, useContext } from "react";
// import type { ReactNode } from "react";
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

const SessionContext = createContext<any>(null);

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: any) {
  const { showPopup, idleTime, handleRefresh, handleLogout, isLoading } =
    useSessionManager();

  return (
    <SessionContext.Provider value={{}}>
      {children}

      <SessionDialog
        open={showPopup}
        idleTime={idleTime}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        isLoading={isLoading}
      />
    </SessionContext.Provider>
  );
}

function SessionDialog({
  open,
  idleTime,
  onRefresh,
  onLogout,
  // isLoading,
}: any) {
  if (!open) return null;

  // ⏳ remaining = 15min - idle
  const remaining = Math.max(0, 15 * 60 * 1000 - idleTime);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <Dialog open={open}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session Expiring</DialogTitle>
          <DialogDescription>
            You will be logged out in{" "}
            <b>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </b>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>

          <Button onClick={onRefresh}>Extend Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
