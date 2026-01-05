import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="font-semibold">My Wallet</div>
        <ActionButton
          type="link"
          title="View my wallet"
          onClick={() => navigate(ROUTES.MY_WALLET)}
        />
      </div>

      {/* Cards */}
      <div
        className="
          w-full
          grid
          grid-cols-2

          sm:flex
          sm:gap-0
          sm:h-full
          sm:overflow-hidden
        
        "
      >
        <WalletCard className="rounded-tl-md sm:rounded-l-md" />
        <WalletCard className="rounded-tr-md sm:rounded-tr-none" />
        <WalletCard className="rounded-bl-md sm:rounded-bl-none" />
        <WalletCard className="rounded-br-md sm:rounded-r-md" />
      </div>
    </div>
  );
}
const WalletCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        className,
        "bg-white hover:bg-primary/10 hover:border-primary border-1 flex-1 h-full flex items-center justify-center flex-col p-1 sm:flex-1 sm:h-full"
      )}
    >
      <div className="text-xs md:text-lg">USD</div>
      <div className="text-sm md:text-3xl">5600</div>
    </div>
  );
};
