import {
  default as DeleteIcon,
  default as TrashIcon,
} from "@/assets/icons/delete.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import PlusIcon from "@/assets/icons/upload-icon.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PhoneInput from "@/components/shared/PhoneInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import {
  useInfinitePayoutLocations,
  usePayoutLocations,
} from "@/hooks/data/usePayoutLocation";
import { usePayoutLocationFilters } from "@/hooks/data/usePayoutLocationFilters";
import type { PayoutLocation } from "@/types/payoutLocation/PayoutLocation";
import type { RemittanceMethod } from "@/types/remittanceMethod/RemittanceMethod";
import React from "react";

interface PayoutAgent {
  id: number;
  business_name: string;
  code: string;
  address: {
    location: string;
    country: string;
  };
  description?: string;
  enabled?: boolean;
}

interface SelectedPayoutAgent {
  id: string;
  payout_agent_id: number;
  account_number: string;
}

interface RemittanceMethodStepProps {
  remittanceMethods: RemittanceMethod[];
  payoutAgents: PayoutAgent[];
  formData: {
    remittance_methods: Array<{
      id?: string;
      remittance_method_id: number;
      verification_status: "pending" | "verified" | "failed";
      verification_data?: {
        account_name_prefix: string;
        account_id_prefix: string;
      };
      service_data?: {
        phone_number: string;
        country_phone_code: string;
      };
      account_number?: string;
      added_to_recipient?: boolean;
      database_id?: number; // For edit mode - the actual database ID
    }>;
    payout_agents: SelectedPayoutAgent[];
    country_phone_code: string;
    country_id?: string;
  };
  countryPhoneOptions: Array<{
    value: string;
    label: string;
    code: string;
    countryCode: string;
  }>;
  countryOptions: Array<{
    value: string;
    label: string;
    iso2?: string;
  }>;
  onAddRemittanceMethod: (methodId: number) => void;
  onUpdateRemittanceMethod: (id: string, field: string, value: unknown) => void;
  onVerifyAccount: (id: string) => void;
  onRemoveRemittanceMethod: (id: string) => void;
  onAddMethodToRecipient: (id: string) => void;
  onEditRemittanceMethod?: (
    databaseId: number,
    data: Partial<{
      remittance_method_id: number;
      verification_status: "pending" | "verified" | "failed";
      verification_data?: {
        account_name_prefix: string;
        account_id_prefix: string;
      };
      service_data?: {
        phone_number: string;
        country_phone_code: string;
      };
      account_number?: string;
    }>,
  ) => void;
  onDeleteRemittanceMethod?: (databaseId: number) => void;
  onAddPayoutAgent: (payoutAgentId: number) => void;
  onRemovePayoutAgent: (id: string) => void;
  isVerifying: boolean;
  isAddingRemittanceMethod?: boolean;
  isEditMode?: boolean;
}

const RemittanceMethodStep: React.FC<RemittanceMethodStepProps> = ({
  remittanceMethods,
  payoutAgents,
  formData,
  countryPhoneOptions,
  countryOptions,
  onAddRemittanceMethod,
  onUpdateRemittanceMethod,
  onVerifyAccount,
  onRemoveRemittanceMethod,
  onAddMethodToRecipient,
  onEditRemittanceMethod,
  onDeleteRemittanceMethod,
  onAddPayoutAgent,
  onRemovePayoutAgent,
  isVerifying,
  isAddingRemittanceMethod = false,
  isEditMode = false,
}) => {
  const [selectedMethodId, setSelectedMethodId] = React.useState<number | null>(
    null,
  );
  const [selectedPayoutAgentId, setSelectedPayoutAgentId] = React.useState<
    number | null
  >(null);

  // Payout location filtering
  const { filtersString, updateCountryFilter, filters } =
    usePayoutLocationFilters();
  const { data: payoutLocationsResponse, isLoading: payoutLocationsLoading } =
    usePayoutLocations(filtersString);

  // Set default country filter to recipient's country (using ISO2 code)
  React.useEffect(() => {
    if (formData.country_id && countryOptions.length > 0) {
      const recipientCountry = countryOptions.find(
        (country) => country.value === formData.country_id,
      );
      if (recipientCountry?.iso2) {
        updateCountryFilter([recipientCountry.iso2]);
      }
    }
  }, [formData.country_id, countryOptions, updateCountryFilter]);

  const methodOptions = remittanceMethods.map((method) => ({
    value: method.id.toString(),
    label: method.name,
  }));

  // Use filtered payout locations instead of props
  const filteredPayoutAgents = payoutLocationsResponse?.data || [];

  // const availablePayoutAgents = filteredPayoutAgents.filter(
  //   (agent: PayoutAgent) =>
  //     !formData.payout_agents.some(
  //       (selected) => selected.payout_agent_id === agent.id,
  //     ),
  // );
  const {
    data: payoutLocationsInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePayoutLocations(filtersString);
  // Flatten all pages into a single array
  const payoutLocationsData = React.useMemo(() => {
    if (!payoutLocationsInfiniteData) return { data: [] };
    const allData = payoutLocationsInfiniteData.pages.flatMap(
      (page) => page.data || [],
    );
    return { data: allData };
  }, [payoutLocationsInfiniteData]);
  // const payoutAgentOptions = availablePayoutAgents.map(
  //   (agent: PayoutAgent) => ({
  //     value: agent.id.toString(),
  //     label: `${agent.business_name} - ${agent.address.location}, ${agent.address.country}`,
  //   }),
  // );
  const payoutAgentOptions =
    payoutLocationsData?.data?.map((payout: PayoutLocation) => ({
      label: `${payout.business_name} - ${payout.address?.location || ""}, ${
        payout.address?.country || ""
      }`,
      value: payout.id.toString(),
    })) || [];

  const handleAddMethod = () => {
    if (selectedMethodId) {
      onAddRemittanceMethod(selectedMethodId);
      setSelectedMethodId(null);
    }
  };

  const handleAddPayoutAgent = () => {
    if (selectedPayoutAgentId) {
      onAddPayoutAgent(selectedPayoutAgentId);
      setSelectedPayoutAgentId(null);
    }
  };

  const renderRemittanceMethodCard = (methodData: {
    id?: string;
    remittance_method_id: number;
    verification_status: "pending" | "verified" | "failed";
    verification_data?: {
      account_name_prefix: string;
      account_id_prefix: string;
    };
    service_data?: {
      phone_number: string;
      country_phone_code: string;
    };
    account_number?: string;
    added_to_recipient?: boolean;
    database_id?: number;
  }) => {
    const method = remittanceMethods.find(
      (m) => m.id === methodData.remittance_method_id,
    );
    if (!method) return null;

    const hasValidationType = method.validator_id;
    const isVerified = methodData.verification_status === "verified";
    const isFailed = methodData.verification_status === "failed";
    const isAddedToRecipient = methodData.added_to_recipient;

    const canVerify =
      hasValidationType &&
      methodData.service_data?.phone_number &&
      methodData.service_data?.country_phone_code &&
      methodData.verification_data?.account_name_prefix &&
      methodData.verification_data?.account_id_prefix;

    return (
      <div key={methodData.id} className="bg-gray-50 rounded-lg p-3 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">
                {method.name}
              </h4>
              <p className="text-xs text-gray-600">
                {methodData.service_data?.country_phone_code}
                {methodData.service_data?.phone_number} •{" "}
                {methodData.account_number || ""}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditMode && methodData.database_id && onEditRemittanceMethod && (
              <button
                onClick={() => {
                  const editData = {
                    remittance_method_id: methodData.remittance_method_id,
                    verification_status: methodData.verification_status,
                    verification_data: methodData.verification_data,
                    service_data: methodData.service_data,
                    account_number: methodData.account_number,
                  };
                  onEditRemittanceMethod(methodData.database_id!, editData);
                }}
                className="text-primary p-1 hover:bg-gray-100 rounded"
                title="Edit remittance method"
              >
                <EditIcon className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => {
                if (
                  isEditMode &&
                  methodData.database_id &&
                  onDeleteRemittanceMethod
                ) {
                  onDeleteRemittanceMethod(methodData.database_id);
                } else if (methodData.id) {
                  onRemoveRemittanceMethod(methodData.id);
                }
              }}
              className="text-red-500 p-1 hover:bg-gray-100 rounded"
              title={
                isEditMode
                  ? "Delete remittance method"
                  : "Remove remittance method"
              }
            >
              <DeleteIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {hasValidationType && !isAddedToRecipient ? (
          <div className="ml-6 space-y-3">
            {/* Phone Number - only show if not verified yet */}
            {!isVerified && (
              <div className="space-y-1">
                <Label className="text-xs">Phone Number *</Label>
                <PhoneInput
                  countryOptions={countryPhoneOptions}
                  selectedCountry={
                    methodData.service_data?.country_phone_code ||
                    formData.country_phone_code
                  }
                  phoneNumber={methodData.service_data?.phone_number || ""}
                  onCountryChange={(countryCode) =>
                    methodData.id &&
                    onUpdateRemittanceMethod(
                      methodData.id,
                      "service_data.country_phone_code",
                      `+${countryCode}`,
                    )
                  }
                  onPhoneChange={(phoneNumber) =>
                    methodData.id &&
                    onUpdateRemittanceMethod(
                      methodData.id,
                      "service_data.phone_number",
                      phoneNumber,
                    )
                  }
                  placeholder="Enter phone number"
                />
              </div>
            )}
            {/* Verification Data and Verify Button in same row */}
            {!isVerified && (
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Account Name Prefix *</Label>
                  <Input
                    className="h-8 text-xs"
                    value={
                      methodData.verification_data?.account_name_prefix || ""
                    }
                    onChange={(e) =>
                      methodData.id &&
                      onUpdateRemittanceMethod(
                        methodData.id,
                        "verification_data.account_name_prefix",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Joh"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Account ID Prefix *</Label>
                  <Input
                    className="h-8 text-xs"
                    value={
                      methodData.verification_data?.account_id_prefix || ""
                    }
                    onChange={(e) =>
                      methodData.id &&
                      onUpdateRemittanceMethod(
                        methodData.id,
                        "verification_data.account_id_prefix",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., 1-1"
                  />
                </div>

                <ActionButton
                  title={isVerifying ? "Verifying..." : "Verify"}
                  onClick={() =>
                    methodData.id && onVerifyAccount(methodData.id)
                  }
                  buttonProps={{
                    disabled: !canVerify || isVerifying,
                    className: "h-8 px-3 text-xs",
                  }}
                />
              </div>
            )}

            {/* Status Messages */}
            {isVerified && !isAddedToRecipient && (
              <div className="flex justify-between items-center p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 text-xs">
                  ✅ <strong>Account Verified Successfully!</strong>
                </p>
                <ActionButton
                  title={
                    isAddingRemittanceMethod
                      ? "Adding..."
                      : "Add Method for Recipient"
                  }
                  onClick={() =>
                    methodData.id && onAddMethodToRecipient(methodData.id)
                  }
                  buttonProps={{
                    disabled: isAddingRemittanceMethod,
                    className: "h-7 px-3 text-xs",
                  }}
                />
              </div>
            )}
            {isAddedToRecipient && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800 text-xs">
                  📋 <strong>Added to Recipient</strong>
                </p>
              </div>
            )}
            {isFailed && (
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 text-xs">
                  ❌ <strong>Verification Failed:</strong> Please check your
                  details and try again.
                </p>
              </div>
            )}
          </div>
        ) : hasValidationType && isAddedToRecipient ? (
          <div className="ml-6 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-xs">
              📋 <strong>Added to Recipient</strong>
            </p>
          </div>
        ) : (
          <div className="ml-6 space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Account Number</Label>
              <Input
                className="h-8 text-xs"
                value={methodData.account_number || ""}
                onChange={(e) =>
                  methodData.id &&
                  onUpdateRemittanceMethod(
                    methodData.id,
                    "account_number",
                    e.target.value,
                  )
                }
                placeholder="Enter account number"
              />
            </div>
            <ActionButton
              title={
                isAddingRemittanceMethod
                  ? "Adding..."
                  : "Add Method for Recipient"
              }
              onClick={() =>
                methodData.id && onAddMethodToRecipient(methodData.id)
              }
              buttonProps={{
                disabled: isAddingRemittanceMethod,
                className: "h-7 px-3 text-xs",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cash Pick up address section */}
      <div className="border border-dashed border-primary rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Cash Pick up address</h3>

        {/* Selected Payout Agents */}
        <div className="space-y-4 mb-6">
          {formData.payout_agents.map((selectedAgent) => {
            const agent = [...payoutAgents, ...filteredPayoutAgents].find(
              (a) => a.id === selectedAgent.payout_agent_id,
            );

            return (
              <div
                key={selectedAgent.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="selected-payout-agent"
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {agent?.business_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {agent?.address.location}, {agent?.address.country}
                    </div>
                    {selectedAgent.account_number && (
                      <div className="text-sm text-gray-600">
                        Account: {selectedAgent.account_number}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePayoutAgent(selectedAgent.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Remove"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add New Address */}

        <div className=" ">
          <div className="flex items-center space-x-2 text-primary">
            <PlusIcon className="w-5 h-5" />
            <span className="font-medium">Add New Address</span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Filter by Country</Label>
              <SearchableSelect
                value={filters.country_codes?.[0] || ""}
                onChange={(value: string | number) => {
                  const countryCode = value.toString();
                  updateCountryFilter(countryCode ? [countryCode] : []);
                }}
                options={countryOptions.map((country) => ({
                  value: country.iso2 || country.value, // Use ISO2 code as value
                  label: country.label, // Display country name
                }))}
                placeholder="Select a country to filter"
              />
            </div>

            <div className="space-y-2">
              <Label>Select Payout Location *</Label>
              <SearchableSelect
                value={selectedPayoutAgentId?.toString() || ""}
                onChange={(value: string | number) =>
                  setSelectedPayoutAgentId(parseInt(value.toString()))
                }
                options={payoutAgentOptions}
                placeholder={
                  payoutLocationsLoading
                    ? "Loading..."
                    : "Select a payout location"
                }
                disabled={payoutLocationsLoading}
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
              />
            </div>

            <div className="flex justify-start">
              <ActionButton
                title="Add Location"
                onClick={handleAddPayoutAgent}
                buttonProps={{
                  disabled: !selectedPayoutAgentId,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet account section */}
      <div className="border border-dashed border-primary rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Wallet Account</h3>

        {/* Existing Methods */}
        <div className="space-y-4 mb-6">
          {formData.remittance_methods.map(renderRemittanceMethodCard)}
        </div>

        {/* Add New Wallet */}
        <div className="">
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Remittance Method *</Label>
              <SearchableSelect
                value={selectedMethodId?.toString() || ""}
                onChange={(value: string | number) =>
                  setSelectedMethodId(parseInt(value.toString()))
                }
                options={methodOptions}
                placeholder="Select a Payment method"
              />
            </div>

            <div className="flex justify-start">
              <ActionButton
                title="Add Method"
                onClick={handleAddMethod}
                buttonProps={{
                  disabled: !selectedMethodId,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemittanceMethodStep;
