import { useNavigate } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/data/useAuth";
import { ROUTES } from "@/constants/routes";
import Loader from "@/components/shared/Loader";
import ActionButton from "@/components/shared/ActionButton";

export default function VerificationEmailPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const token = params.get("token");
  const { data: verificationResponse, isPending } = useVerifyEmail({
    token: token!,
    email: email!,
  });

  const goToLogin = () => {
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <h1 className="text-primary text-xl font-bold">
        Verify your email address:{" "}
        <span className="text-gray-900">{email}</span>
      </h1>

      {isPending && (
        <Loader className="bg-primary/10 rounded-md min-h-[50vh]" />
      )}

      {verificationResponse?.status === true && (
        <div className="flex items-center gap-2">
          <p className="text-primary">{verificationResponse?.message}</p>
          <ActionButton onClick={goToLogin} title="Go to Login" type="action" />
        </div>
      )}

      {verificationResponse?.status === false && (
        <div className="flex items-center gap-1">
          <p className="text-destructive">{verificationResponse?.message}</p>
        </div>
      )}
    </div>
  );
}
