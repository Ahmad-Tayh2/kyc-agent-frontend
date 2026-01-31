import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import PrintIcon from "@/assets/icons/print.svg?react";
import { useGetTransfer } from "@/hooks/data/useTransfers";
// import Loader from "@/components/shared/Loader";
import DetailsCard from "./DetailsCard";
import Loader from "@/components/shared/Loader";
import { useReactToPrint } from "react-to-print";

const TransfersDetails: React.FC = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, error } = useGetTransfer(id!);

  const handleBack = () => {
    navigate(-1);
  };
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    // content: () => printRef.current,
    documentTitle: "Printed Section",
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg font-medium">
          {t("modules.pages.transfers.details.error_loading")}
        </div>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          {t("common.back")}
        </Button>
      </div>
    );
  }

  const transfer: any = response?.data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex justify-start items-center gap-3">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer hover:text-primary/80 transition-colors"
            aria-label={t("common.back")}
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <PageTitle title={t("modules.pages.transfers.details.title")} />
        </div>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="bg-white border-1 border-gray-200 px-3 text-foreground hover:bg-gray-50 font-normal transition-colors"
        >
          <PrintIcon />
          <span>{t("common.buttons.print")}</span>
        </Button>
      </div>

      {/* Transfer Details */}
      <DetailsCard transfer={transfer} printAreaRef={printRef} />
    </div>
  );
};

export default TransfersDetails;
