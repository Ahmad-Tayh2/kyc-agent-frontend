import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import ActionButton from "../shared/ActionButton";

export default function IssueHeader() {
  const navigate = useNavigate();
  const handleBackToSupport = () => {
    navigate(ROUTES.SUPPORT.LIST);
  };
  return (
    <div className="flex items-center bg-white justify-between p-5">
      <div className="flex justify-start items-center gap-3">
        <button
          onClick={handleBackToSupport}
          className="text-primary top-1 cursor-pointer hover:text-primary/80 transition-colors"
        >
          <BackArrowIcon width={30} height={30} />
        </button>
        <div className="font-400 text-xl">Reference number: 634567538878</div>
      </div>
      <div>
        <ActionButton title="RESOLVED" />
      </div>
    </div>
  );
}
