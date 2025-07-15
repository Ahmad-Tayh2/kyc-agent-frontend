import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InfoIcon from "@/assets/icons/info.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/constants/routes";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

interface BusinessTypeStepProps {
  onNext: (type: "sales" | "partner", partnerRoles?: string[]) => void;
}

const BusinessTypeStep: React.FC<BusinessTypeStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<"sales" | "partner" | null>(null);
  const [partnerRoles, setPartnerRoles] = useState<string[]>([]);
  const [t] = useTranslation("global");

  const handleRoleChange = (role: string) => {
    setPartnerRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 my-70">
      <h1 className="text-3xl font-bold mb-6">
        {t("modules.register.businessType.title")}
      </h1>
      <div className="space-y-4">
        <button
          type="button"
          className={cn(
            "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[18px] font-semibold text-left transition",
            selected === "sales"
              ? "border-primary bg-primary/10"
              : "border-gray-200 bg-white"
          )}
          onClick={() => {
            setSelected("sales");
            setPartnerRoles([]);
          }}
        >
          {selected === "sales" ? <CheckedIcon /> : <UncheckedIcon />}
          {t("modules.register.businessType.salesPerson")}
          <span
            className="ml-2 text-gray-400 text-xs"
            title={t("modules.register.businessType.salesPersonTooltip")}
          >
            <InfoIcon />
          </span>
        </button>
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-1 border rounded-lg px-4 py-3 text-[18px] font-semibold text-left transition",

            selected === "partner"
              ? "border-primary bg-primary/10"
              : "border-gray-200 bg-white"
          )}
          onClick={() => setSelected("partner")}
        >
          {selected === "partner" ? <CheckedIcon /> : <UncheckedIcon />}
          {t("modules.register.businessType.businessPartner")}
          <span
            className="ml-2 text-gray-400 text-xs"
            title={t("modules.register.businessType.businessPartnerTooltip")}
          >
            <InfoIcon />
          </span>
        </button>
        {selected === "partner" && (
          <>
            <div className="mt-4 flex gap-8">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={partnerRoles.includes("sending")}
                  onCheckedChange={() => handleRoleChange("sending")}
                />
                {t("modules.register.businessType.partnerRoles.sending")}
                <span
                  className="text-gray-400 text-xs"
                  title={t("modules.register.businessType.partnerRoles.sendingTooltip")}
                >
                  <InfoIcon />
                </span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={partnerRoles.includes("payout")}
                  onCheckedChange={() => handleRoleChange("payout")}
                />
                {t("modules.register.businessType.partnerRoles.payout")}
                <span
                  className="text-gray-400 text-xs"
                  title={t("modules.register.businessType.partnerRoles.payoutTooltip")}
                >
                  <InfoIcon />
                </span>
              </label>
            </div>
            <div className="bg-primary/10 text-xs rounded p-2 mt-2">
              {t("modules.register.businessType.partnerRoles.description")}
            </div>
          </>
        )}
      </div>
      <Separator />
      <Button
        className="w-32 mt-4"
        disabled={
          !selected || (selected === "partner" && !partnerRoles?.length)
        }
        onClick={() =>
          selected === "sales"
            ? onNext("sales")
            : onNext("partner", partnerRoles)
        }
      >
        {t("common.buttons.next")}
      </Button>
      <div className="mt-4 text-sm">
        {t("modules.register.alreadyHaveAccount")}{" "}
        <a
          href={ROUTES.AUTH.LOGIN}
          className="text-primary hover:underline font-medium"
        >
          {t("modules.register.loginLink")}
        </a>
      </div>
    </div>
  );
};

export default BusinessTypeStep;
