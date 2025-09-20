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
      <div className="flex flex-col gap-10">
        {remittanceCartsData?.map((cartData: any) => {
          const {
            customer,
            created_at,
            total_amount,
            payment_links,
            currency,
          } = cartData;
          return (
            <div>
              <div className="font-semibold my-2">
                <span className="text-primary">Remittance Cart: </span>
                {customer?.first_name} {customer?.last_name} / {currency}
              </div>
              <div
                className="bg-white rounded-md overflow-auto"
                key={cartData?.id}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px",
                }}
              >
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RemittanceCartPage;
