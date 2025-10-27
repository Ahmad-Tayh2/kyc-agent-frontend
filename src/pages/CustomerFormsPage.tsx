import React from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "../components/shared/DataTable";
import { useCustomerForm } from "@/hooks/data/useCustomerForm";
import type { CustomerForm } from "@/types/customerForm/CustomerForm";
import copyIcon from "@/assets/icons/clipboard.svg";
import { Button } from "@/components/ui/button";
import CustomerFormDialog from "@/components/customerForm/CustomerFormDialog";
import { useState } from "react";
import StatusLabel from "@/components/shared/StatusLabel";
import CustomerFormDialogWrapper from "@/components/customerForm/CustomerFormDialogWrapper";
import CustomerFormFilters from "@/components/customerForm/CustomerFormFilters";
import { useCustomerFormFilters } from "@/hooks/data/useCustomerFormFilters";

import { copyToClipboard } from "@/helpers/text";

type CustomerFormTableData = {
  id: number;
  fullName: string;
  status: string;
  customer_id: number;
  frontendFormUrl: string;
  token: string;
  createdAt: string;
};

const CustomerFormsPage: React.FC = () => {
  const [t] = useTranslation("global");

  const {
    filters,
    filtersString,
    updateStatus,
    updateDateRange,
    resetFilters,
    applyFilters,
  } = useCustomerFormFilters();

  const { data: customerForms } = useCustomerForm(filtersString);
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  // Prepare the data for the table
  const customerFormData: CustomerFormTableData[] = Array.isArray(customerForms)
    ? customerForms.map((item: CustomerForm) => ({
        id: item.id,
        fullName: `${item.first_name} ${item.last_name}`,
        status: item.status,
        customer_id: item.customer_id,
        frontendFormUrl: item.form_urls.frontend_form_url,
        token: item.token,
        createdAt: item.created_at,
      }))
    : []; // Define columns for the DataTable
  const columns = [
    {
      header: t("modules.pages.customerForm.columns.fullName"),
      accessorKey: "fullName",
      size: 200,
    },
    {
      header: t("modules.pages.customerForm.columns.status"),
      accessorKey: "status",
      size: 180,

      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case "successful_registration":
              return {
                label: t(
                  "modules.pages.customerForm.statuses.registrationSuccessful"
                ),
                color: "#027A48",
              };
            case "valid_link":
              return {
                label: t("modules.pages.customerForm.statuses.linkValid"),
                color: "#DF6B1D",
              };
            case "expired_link":
              return {
                label: t("modules.pages.customerForm.statuses.linkExpired"),
                color: "#B42318",
              };
            default:
              return { label: status, color: "#6B7280" };
          }
        };

        const statusConfig = getStatusConfig(row.original.status);

        return (
          <StatusLabel value={statusConfig.label} color={statusConfig.color} />
        );
      },
    },
    {
      header: t("modules.pages.customerForm.columns.formUrl"),
      accessorKey: "frontendFormUrl",

      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const token = row.original.token;
        const url = window.location.origin + "/customer-form/" + token;
        const displayUrl = url.length > 55 ? `${url.slice(0, 55)}...` : url;

        return (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 break-all">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  // Always show preview dialog for agents
                  const token = url.split("/").pop() || "";
                  setPreviewToken(token);
                }}
              >
                {displayUrl}
              </a>
            </span>

            <button
              onClick={() => copyToClipboard(url)}
              className="p-1 hover:bg-gray-100 rounded ml-[10px] cursor-pointer group"
              title="Copy URL"
            >
              <img
                src={copyIcon}
                alt="Copy"
                className="w-4 h-4 group-hover:cursor-pointer"
                style={{ cursor: "inherit" }}
              />
            </button>
          </div>
        );
      },
    },
    {
      header: t("modules.pages.customerForm.columns.createdAt"),
      accessorKey: "createdAt",
      size: 150,

      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const date = new Date(row.original.createdAt);

        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",

          month: "2-digit",

          year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",

          minute: "2-digit",
        });

        return (
          <span className="whitespace-nowrap">
            {formattedDate} {formattedTime}
          </span>
        );
      },
    },
    {
      header: t("modules.pages.customerForm.columns.actions"),
      accessorKey: "id",
      size: 250,

      cell: ({ row }: { row: { original: CustomerFormTableData } }) => {
        const renderActions = () => {
          switch (row.original.status) {
            case "valid_link":
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      console.log("Resend clicked for:", row.original.id)
                    }
                    className="text-[#00B386] hover:text-[#009973] underline text-sm whitespace-nowrap"
                  >
                    {t("modules.pages.customerForm.actions.resend")}
                  </button>
                </div>
              );

            case "expired_link":
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      console.log(
                        "Generate new link clicked for:",

                        row.original.id
                      )
                    }
                    className="text-[#00B386] hover:text-[#009973] underline text-sm whitespace-nowrap"
                  >
                    {t("modules.pages.customerForm.actions.generateNewLink")}
                  </button>
                </div>
              );

            case "successful_registration":
              return (
                <div className="flex gap-2">
                  <a
                    href={`/customers/${row.original.customer_id}/edit`}
                    className="text-[#00B386] hover:text-[#009973] underline text-sm whitespace-nowrap"
                  >
                    {t("modules.pages.customerForm.actions.customerDetails")}
                  </a>
                </div>
              );

            default:
              return (
                <div className="flex gap-2">
                  <a
                    href={`/customer-forms/${row.original.id}`}
                    className="text-[#00B386] hover:text-[#009973] underline text-sm whitespace-nowrap"
                  >
                    {t("modules.pages.customerForm.actions.view")}
                  </a>
                </div>
              );
          }
        };

        return <div>{renderActions()}</div>;
      },
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2">
        <h1 className="text-2xl font-bold">
          {t("modules.pages.customerForm.title")}
        </h1>
        <div className="flex items-center gap-3">
          <CustomerFormFilters
            filters={filters}
            updateStatus={updateStatus}
            updateDateRange={updateDateRange}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
          <CustomerFormDialog
            trigger={
              <Button>
                {t("modules.pages.customerForm.buttons.generateNewLink")}
              </Button>
            }
          />
        </div>
      </div>
      <div className="p-5">
        <DataTable
          data={customerFormData}
          columns={columns}
          tableTitle={t("modules.pages.customerForm.title")}
        />
      </div>

      {/* Preview Dialog - Only opens for valid links */}
      {previewToken && (
        <CustomerFormDialogWrapper
          isOpen={!!previewToken}
          onOpenChange={(open) => !open && setPreviewToken(null)}
          token={previewToken}
          mode="preview"
        />
      )}
    </div>
  );
};

export default CustomerFormsPage;
