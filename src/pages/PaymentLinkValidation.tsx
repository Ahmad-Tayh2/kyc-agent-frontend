import { useCheckPaymentLinkValidation } from "@/hooks/data/usePaymentLinks";
import { cn } from "@/lib/utils";
// import { useEffect } from "react";
import { useParams } from "react-router-dom";
const PaymentLinkValidation = () => {
  const { token } = useParams<{ token: string }>();
  const { data: paymentValidationResponse } = useCheckPaymentLinkValidation(
    token!
  );
  return (
    <div className="space-y-4 h-screen w-screen p-5">
      <div
        className={cn(
          "font-bold",
          paymentValidationResponse?.status ? "text-green-500" : "text-red-500"
        )}
      >
        {paymentValidationResponse?.message}
      </div>
    </div>
  );
};
export default PaymentLinkValidation;
