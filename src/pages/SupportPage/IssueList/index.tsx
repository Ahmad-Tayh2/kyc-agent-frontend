import ActionButton from "@/components/shared/ActionButton";
import { DataTable } from "@/components/shared/DataTable";
import PageTitle from "@/components/shared/PageTitle";
import ReportIssueDialog from "@/components/support/ReportIssueDialog";
import SupportFilters from "@/components/support/SupportFilters";
import { SupportTableColumns } from "@/components/support/SupportTableColumns";
import React from "react";
import { useTranslation } from "react-i18next";

const SupportPage: React.FC = () => {
  const { t } = useTranslation("global");
  const filters = {};
  const updateSearchTerm = () => {};
  const resetFilters = () => {};
  const applyFilters = () => {};
  const columns = SupportTableColumns();
  const handleReportIssue = () => {};
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-3">
        <PageTitle title={t("modules.pages.support.title")} />
        <div className="flex items-center gap-1">
          <SupportFilters
            filters={filters}
            onUpdateSearchTerm={updateSearchTerm}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
          <ReportIssueDialog
            trigger={
              <ActionButton title="Report Issue" onClick={handleReportIssue} />
            }
          />
        </div>
      </div>
      <div>
        <DataTable
          data={[]}
          columns={columns}
          tableTitle={"Consult Documentations"}
        />
      </div>
    </div>
  );
};

export default SupportPage;
