import StatusLabel from "@/components/shared/StatusLabel";
import {
  KYC_DOCUMENT_STATUS_COLORS,
  KYC_DOCUMENT_TYPE_LABELS,
} from "@/constants/appConstants";
import type { KycDocument } from "@/types/kyc";

interface KycDocumentListProps {
  documents: KycDocument[];
}

export default function KycDocumentList({ documents }: KycDocumentListProps) {
  if (!documents.length) {
    return (
      <div className="px-5 pb-5 text-sm text-gray-500">
        No KYC documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 px-5 pb-5">
      <h4 className="text-sm font-semibold text-gray-700">Documents</h4>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Verified at</th>
              <th className="px-3 py-2">Expires at</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2">File</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const typeLabel =
                KYC_DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type;
              const statusColor =
                KYC_DOCUMENT_STATUS_COLORS[doc.verification_status] ?? "#667085";
              return (
                <tr key={doc.id} className="border-t border-gray-200">
                  <td className="px-3 py-2 font-medium">{typeLabel}</td>
                  <td className="px-3 py-2">
                    <StatusLabel
                      value={doc.verification_status}
                      color={statusColor}
                      size="sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {doc.verified_at
                      ? new Date(doc.verified_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {doc.expires_at
                      ? new Date(doc.expires_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {doc.rejection_reason ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {doc.file_url ? (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
