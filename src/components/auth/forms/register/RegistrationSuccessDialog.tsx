import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useResendVerification } from "@/hooks/data/useAuth";

interface RegistrationSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  registrationStatus: "success" | "partial" | "error";
  uploadStatus: "success" | "partial" | "error";
  uploadMessage?: string;
  userEmail: string;
}

const RegistrationSuccessDialog: React.FC<RegistrationSuccessDialogProps> = ({
  isOpen,
  onClose,
  registrationStatus,
  uploadStatus,
  uploadMessage,
  userEmail,
}) => {
  const navigate = useNavigate();
  const [t] = useTranslation("global");
  const { mutateAsync: resendVerification, isPending: isResending } =
    useResendVerification();

  const handleGoToLogin = () => {
    onClose();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification(userEmail);
      toast.success(t("modules.register.success.verificationEmailSent"));
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      toast.error(t("modules.register.success.verificationEmailError"));
    }
  };

  const getStatusIcon = (status: "success" | "partial" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "partial":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: "success" | "partial" | "error") => {
    switch (status) {
      case "success":
        return t("modules.register.success.registrationSuccess");
      case "partial":
        return t("modules.register.success.registrationPartial");
      case "error":
        return t("modules.register.success.registrationError");
      default:
        return "";
    }
  };

  const getUploadStatusText = (status: "success" | "partial" | "error") => {
    switch (status) {
      case "success":
        return t("modules.register.success.uploadSuccess");
      case "partial":
        return t("modules.register.success.uploadPartial");
      case "error":
        return t("modules.register.success.uploadError");
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {t("modules.register.success.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Registration Status */}
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(registrationStatus)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">
                {t("modules.register.success.registrationStatus")}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {getStatusText(registrationStatus)}
              </p>
            </div>
          </div>

          {/* File Upload Status */}
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(uploadStatus)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">
                {t("modules.register.success.uploadStatus")}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {getUploadStatusText(uploadStatus)}
              </p>
              {uploadMessage && (
                <p className="text-xs text-muted-foreground mt-2">
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={handleGoToLogin} className="w-full">
              {t("modules.register.success.goToLogin")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("modules.register.success.resendingVerification")}
                </>
              ) : (
                t("modules.register.success.resendVerification")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccessDialog;
