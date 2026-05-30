import StatusLabel from "@/components/shared/StatusLabel";
import {
  KYC_RISK_LEVEL_COLORS,
  KYC_VERIFICATION_STATUS_COLORS,
} from "@/constants/appConstants";
import type { KycStatusResponse } from "@/types/kyc";

interface KycStatusOverviewProps {
  status: KycStatusResponse;
}

export default function KycStatusOverview({ status }: KycStatusOverviewProps) {
  return (
    <div className="space-y-4 p-5">
      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Verification:</span>
          <StatusLabel
            value={status.verification_status.replace("_", " ")}
            color={
              KYC_VERIFICATION_STATUS_COLORS[status.verification_status] ??
              "#667085"
            }
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Risk:</span>
          <StatusLabel
            value={status.risk_level}
            color={KYC_RISK_LEVEL_COLORS[status.risk_level] ?? "#667085"}
            size="sm"
          />
        </div>
        {status.tier && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tier:</span>
            <span className="text-sm font-medium">{status.tier.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Can Transact:</span>
          <span
            className={`text-sm font-semibold ${status.can_transact ? "text-green-600" : "text-red-600"}`}
          >
            {status.can_transact ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Checks progress */}
      {status.required_checks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Verification Checks ({status.completed_checks.length}/
            {status.required_checks.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {status.required_checks.map((check) => {
              const isCompleted = status.completed_checks.includes(check);
              return (
                <span
                  key={check}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    isCompleted
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  )}
                  {check.replace(/_/g, " ")}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
