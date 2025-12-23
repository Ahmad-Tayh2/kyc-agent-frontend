import PayoutLocationsFilters from "@/components/payoutLocations/PayoutLocationsFilters";
import { DataTable } from "@/components/shared/DataTable";
import { usePayoutLocations } from "@/hooks/data/usePayoutLocation";
import { usePayoutLocationFilters } from "@/hooks/data/usePayoutLocationFilters";
import { useRemittanceMethods } from "@/hooks/data/useRemittanceMethod";
import type { PayoutLocation } from "@/types/payoutLocation/PayoutLocation";
import type { RemittanceMethod } from "@/types/remittanceMethod/RemittanceMethod";
import React, { useMemo } from "react";

const PayoutLocationsPage: React.FC = () => {
  const { data: remittanceMethods } = useRemittanceMethods();

  const {
    filtersString,
    filters,
    updatePagination,
    updateCountryCodes,
    resetFilters,
    applyFilters,
  } = usePayoutLocationFilters();

  const {
    data: payoutLocationsResponse,
    isLoading: payoutLocationsLoading,
    error: payoutLocationsError,
  } = usePayoutLocations(filtersString);

  // Memoize data to prevent unnecessary re-renders
  const remittanceData = useMemo(() => {
    return Array.isArray(remittanceMethods?.data)
      ? remittanceMethods?.data.map((item: RemittanceMethod) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          status: "-",
        }))
      : [];
  }, [remittanceMethods?.data]);

  const payoutLocationData = useMemo(() => {
    return Array.isArray(payoutLocationsResponse?.data)
      ? payoutLocationsResponse?.data
          .filter((item: PayoutLocation) => item.isActive)
          .map((item: PayoutLocation) => ({
            id: item.id,
            business_name: item.business_name,
            location: item.address.location ? item.address.location : "-",
            country: item.address.country ? item.address.country : "-",
            address: `${
              item.address.country ? item.address.country + "," : "-"
            } ${item.address.location ? item.address.location : ""}`,
          }))
      : [];
  }, [payoutLocationsResponse?.data]);

  const payoutLocationsMeta = useMemo(() => {
    return payoutLocationsResponse?.meta || {};
  }, [payoutLocationsResponse?.meta]);

  const payoutLocationsPagination = {
    enable: true,
    page: payoutLocationsMeta?.current_page,
    per_page: payoutLocationsMeta?.per_page,
    total: payoutLocationsMeta?.total,
    from: payoutLocationsMeta?.from,
    to: payoutLocationsMeta?.to,
    last_page: payoutLocationsMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };

  const RemittanceMethodColumns = [
    {
      header: "Remittance Method",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
  ];

  const PayoutLocationColumns = [
    {
      header: "Name",
      accessorKey: "business_name",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
  ];

  return (
    <div className="space-y-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Payout Locations/Methods</h1>
      <DataTable
        data={remittanceData}
        columns={RemittanceMethodColumns}
        tableTitle="Supported Remittance methods"
        enableFrontEndPagination
      />

      <div className="bg-white rounded-t-md">
        <h1 className="p-5 text-2xl font-semibold">Payout Locations</h1>
        <PayoutLocationsFilters
          filters={filters}
          onUpdateCountryCodes={updateCountryCodes}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
        />
        <DataTable
          data={payoutLocationData}
          columns={PayoutLocationColumns}
          // tableTitle="Payout Locations"
          isLoading={payoutLocationsLoading}
          error={payoutLocationsError}
          pagination={payoutLocationsPagination}
          className="min-h-[500px] rounded-t-none"
        />
      </div>
    </div>
  );
};

export default PayoutLocationsPage;
