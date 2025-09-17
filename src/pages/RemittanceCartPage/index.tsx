import { DataTable } from "@/components/shared/DataTable";
import PageTitle from "@/components/shared/PageTitle";
import { remittanceCartColumns } from "@/components/remittanceCart/remittanceCartColumns";
import React, { useMemo } from "react";
import CartHeader from "@/components/remittanceCart/CartHeader";
import { useGetRemittanceCarts } from "@/hooks/data/useRemittanceCarts";

const RemittanceCartPage: React.FC = () => {
  const columns = remittanceCartColumns();
  const { data: response, isLoading, error } = useGetRemittanceCarts();

  const remittanceCartsData = useMemo(() => {
    return response?.data?.data || [];
  }, [response?.data]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title="Remittance Cart" />
      </div>
      {remittanceCartsData?.map((cartData: any) => {
        const { customer, created_at, total_amount, payment_links } = cartData;
        return (
          <div className="bg-white rounded-md overflow-auto" key={cartData?.id}>
            <div className="p-5">
              <CartHeader
                customer={customer}
                date={created_at}
                totalPayableAmount={total_amount}
                paymentLinkData={payment_links?.[0]}
                cartId={cartData?.id}
              />
            </div>
            <DataTable
              data={cartData?.transactions}
              columns={columns}
              className="rounded-none"
              isLoading={isLoading}
              error={error}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RemittanceCartPage;
