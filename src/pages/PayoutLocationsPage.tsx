import React from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useRemittanceMethods } from "@/hooks/data/useRemittanceMethod";
import type { RemittanceMethod } from "@/types/remittanceMethod/RemittanceMethod";
import type { PayoutLocation } from "@/types/payoutLocation/PayoutLocation";
import { usePayoutLocations } from "@/hooks/data/usePayoutLocation";

const PayoutLocationsPage: React.FC = () => {
  const { data: remittanceMethods } = useRemittanceMethods();
  const { data: payoutLocations } = usePayoutLocations();

  // Prepare data for DataTable
  const remittanceData = Array.isArray(remittanceMethods?.data)
    ? remittanceMethods?.data.map((item: RemittanceMethod) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }))
    : [];

  const payoutLocationData = Array.isArray(payoutLocations?.data)
    ? payoutLocations?.data
        .filter((item: PayoutLocation) => item.isActive)
        .map((item: PayoutLocation) => ({
          id: item.id,
          business_name: item.business_name,
          city: item.address.city.name,
          country: item.address.country.name,
          address: `${item.address.house_number}, ${item.address.street_name}, ${item.address.city.name}, ${item.address.country.name}, ${item.address.postal_code}`,
        }))
    : [];

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
      header: "City",
      accessorKey: "city",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
  ];

  return (
    <div className="space-y-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Payout Locations/Methods</h1>
      <div className="p-5">
        <DataTable
          data={remittanceData}
          columns={RemittanceMethodColumns}
          enablePagination={true}
          rowsPerPage={10}
          tableTitle="Remittance Methods"
        />
      </div>
      <div className="p-5">
        <DataTable
          data={payoutLocationData}
          columns={PayoutLocationColumns}
          enablePagination={true}
          rowsPerPage={10}
          tableTitle="Payout Locations"
        />
      </div>
    </div>
  );
};

export default PayoutLocationsPage;
