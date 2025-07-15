import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InfoIcon from "@/assets/icons/info.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/constants/routes";
import { Separator } from "@/components/ui/separator";

interface BusinessTypeStepProps {
  onNext: (type: "sales" | "partner", partnerRoles?: string[]) => void;
}

const BusinessTypeStep: React.FC<BusinessTypeStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<"sales" | "partner" | null>(null);
  const [partnerRoles, setPartnerRoles] = useState<string[]>([]);

  const handleRoleChange = (role: string) => {
    setPartnerRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 my-70">
      <h1 className="text-3xl font-bold mb-6">
        What best describes your business status
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
          {selected === "sales" ? <CheckedIcon /> : <UncheckedIcon />}I am a
          Sales Person
          <span
            className="ml-2 text-gray-400 text-xs"
            title="A person who sells products/services"
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
          {selected === "partner" ? <CheckedIcon /> : <UncheckedIcon />}I am a
          Business Partner/Company
          <span
            className="ml-2 text-gray-400 text-xs"
            title="A business or company partner"
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
                Sending Partner
                <span
                  className="text-gray-400 text-xs"
                  title="Partner for sending money"
                >
                  <InfoIcon />
                </span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={partnerRoles.includes("payout")}
                  onCheckedChange={() => handleRoleChange("payout")}
                />
                Payout Partner
                <span
                  className="text-gray-400 text-xs"
                  title="Partner for paying out transfers"
                >
                  <InfoIcon />
                </span>
              </label>
            </div>
            <div className="bg-primary/10 text-xs rounded p-2 mt-2">
              You can be our partner for either sending money, paying out
              transfers or doing both at the same time
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
        NEXT
      </Button>
      <div className="mt-4 text-sm">
        Already have an account?{" "}
        <a
          href={ROUTES.AUTH.LOGIN}
          className="text-primary hover:underline font-medium"
        >
          Log in
        </a>
      </div>
    </div>
  );
};

export default BusinessTypeStep;
