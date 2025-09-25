import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="font-semibold">My Wallet</div>
        <ActionButton
          type="link"
          title="View my wallet"
          onClick={() => navigate(ROUTES.MY_WALLET)}
        />
      </div>
      <div className="flex items-center flex-1 flex-1 w-full overflow-hidden">
        <WalletCard className="rounded-l-md" />
        <WalletCard />
        <WalletCard />
        <WalletCard className="rounded-r-md" />
      </div>
    </div>
  );
}

const WalletCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        className,
        "bg-white hover:bg-primary/10 hover:border-primary border-1 flex-1 h-full flex items-center justify-center flex-col "
      )}
    >
      <div className="text-lg">USD</div>
      <div className="text-3xl">5600</div>
    </div>
  );
};
