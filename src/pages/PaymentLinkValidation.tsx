import { useCheckPaymentLinkValidation } from "@/hooks/data/usePaymentLinks";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
const PaymentLinkValidation = () => {
  const { token } = useParams<{ token: string }>();
  const {
    data: paymentValidationResponse,
    isSuccess,
    isError,
  } = useCheckPaymentLinkValidation(token!);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      isSuccess &&
      paymentValidationResponse?.status &&
      paymentValidationResponse?.data?.payable_id
    ) {
      navigate(
        `/payment/transaction/${paymentValidationResponse?.data?.payable_id}`,
        { replace: true }
      );
    }
  }, [paymentValidationResponse?.status, isSuccess]);
  return (
    <div className="space-y-4 h-screen w-screen p-5">
      <div
        className={cn(
          "font-bold",
          paymentValidationResponse?.status ? "text-green-500" : "text-red-500"
        )}
      >
        {isError && "Something goes wrong"}
      </div>
    </div>
  );
};
export default PaymentLinkValidation;
