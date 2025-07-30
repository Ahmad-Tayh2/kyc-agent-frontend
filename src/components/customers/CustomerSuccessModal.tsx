import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";

interface CustomerSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const CustomerSuccessModal: React.FC<CustomerSuccessModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const { t } = useTranslation("global");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">{t("modules.components.customerSuccessModal.title")}</h2>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {t("modules.components.customerSuccessModal.close")}
            </Button>
            <Button
              onClick={onContinue}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {t("modules.components.customerSuccessModal.viewDetails")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSuccessModal; 