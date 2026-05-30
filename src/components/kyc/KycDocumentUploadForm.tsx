import { useState } from "react";
import { Input } from "@/components/ui/input";
import ActionButton from "@/components/shared/ActionButton";
import { useUploadKycDocument } from "@/hooks/data/useKyc";
import { KYC_DOCUMENT_TYPE_LABELS } from "@/constants/appConstants";
import type { KycDocumentType } from "@/types/kyc";

interface KycDocumentUploadFormProps {
  customerId: string | number;
}

const DOCUMENT_TYPES: KycDocumentType[] = [
  "passport",
  "national_id",
  "driving_license",
  "proof_of_address",
  "selfie",
  "source_of_funds",
];

export default function KycDocumentUploadForm({
  customerId,
}: KycDocumentUploadFormProps) {
  const [documentType, setDocumentType] = useState<KycDocumentType>("passport");
  const [file, setFile] = useState<File | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>("");

  const { mutate: uploadDocument, isPending } = useUploadKycDocument(() => {
    setFile(null);
    setExpiresAt("");
  });

  const handleSubmit = () => {
    if (!file) return;
    uploadDocument({
      customer_id: customerId,
      document_type: documentType,
      document: file,
      expires_at: expiresAt || null,
    });
  };

  return (
    <div className="space-y-3 px-5 pb-5">
      <h4 className="text-sm font-semibold text-gray-700">
        Upload KYC Document
      </h4>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(e.target.value as KycDocumentType)
            }
            className="border-input h-11 rounded-md border bg-transparent px-3 text-sm"
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {KYC_DOCUMENT_TYPE_LABELS[type] ?? type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">File</label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept="image/*,application/pdf"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            Expires at (optional)
          </label>
          <Input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </div>
      <div>
        <ActionButton
          title={isPending ? "Uploading..." : "Upload document"}
          onClick={handleSubmit}
          disabled={!file || isPending}
        />
      </div>
    </div>
  );
}
