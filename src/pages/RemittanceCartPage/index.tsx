import { DataTable } from "@/components/shared/DataTable";
import PageTitle from "@/components/shared/PageTitle";
import { remittanceCartColumns } from "@/components/remittanceCart/remittanceCartColumns";
import React, { useMemo } from "react";
import CartHeader from "@/components/remittanceCart/CartHeader";
import { useGetRemittanceCarts } from "@/hooks/data/useGetRemittanceCarts";

const RemittanceCartPage: React.FC = () => {
  const columns = remittanceCartColumns();
  const { data: response, isLoading, error } = useGetRemittanceCarts();

  const remittanceCartsData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title="Remittance Cart" />
      </div>
      <div className="bg-white rounded-md overflow-auto">
        <div className="p-5">
          <CartHeader />
        </div>
        <DataTable
          data={remittanceCartsData}
          columns={columns}
          className="rounded-none"
          isLoading={isLoading}
          error={error}
        />
      </div>
      <div className="bg-white rounded-md overflow-auto">
        <div className="p-5">
          <CartHeader />
        </div>
        <DataTable
          data={[]}
          columns={columns}
          className="rounded-none"
          // isLoading={isLoading}
          // error={error}
          // pagination={pagination}
        />
      </div>
      <div className="bg-white rounded-md overflow-auto">
        <div className="p-5">
          <CartHeader />
        </div>
        <DataTable
          data={[]}
          columns={columns}
          className="rounded-none"
          // isLoading={isLoading}
          // error={error}
          // pagination={pagination}
        />
      </div>
    </div>
  );
};

export default RemittanceCartPage;
