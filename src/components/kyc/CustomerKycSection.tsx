import { useGetKycStatus } from "@/hooks/data/useKyc";
import KycStatusOverview from "./KycStatusOverview";
import KycDocumentList from "./KycDocumentList";
import KycDocumentUploadForm from "./KycDocumentUploadForm";
import type { KycStatusResponse } from "@/types/kyc";

interface CustomerKycSectionProps {
  customerId: string | number;
  editMode?: boolean;
}

export default function CustomerKycSection({
  customerId,
  editMode = false,
}: CustomerKycSectionProps) {
  const { data, isLoading, error } = useGetKycStatus(customerId);

  if (isLoading) {
    return <div className="p-5 text-center text-sm text-gray-500">Loading KYC status...</div>;
  }

  if (error) {
    return (
      <div className="p-5 text-center text-sm text-gray-400">
        KYC profile not available for this customer.
      </div>
    );
  }

  const status: KycStatusResponse | undefined = data?.data;

  if (!status) {
    return <div className="p-5 text-center text-sm text-gray-400">No KYC profile found.</div>;
  }

  return (
    <div>
      <KycStatusOverview status={status} />
      <KycDocumentList documents={status.documents ?? []} />
      {editMode && <KycDocumentUploadForm customerId={customerId} />}
    </div>
  );
}
