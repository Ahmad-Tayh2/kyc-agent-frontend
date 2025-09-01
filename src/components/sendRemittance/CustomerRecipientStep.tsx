import SearchableSelect from "@/components/ui/searchable-select";
import { ROUTES } from "@/constants/routes";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import {
  useGetSendingCurrencies,
  useGetReceivingCurrencies,
} from "@/hooks/data/useCountryAllowedCurrency";
import {
  useAttachRecipientToCustomer,
  useGetCustomerRecipients,
  useGetCustomers,
} from "@/hooks/data/useCustomers";
import { useSearchRecipient } from "@/hooks/data/useRecipients";
import { useRemittanceMethods } from "@/hooks/data/useRemittanceMethod";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import type { CustomerType } from "@/types/customers";
import type { CustomerRecipient } from "@/types/customers/recipients";
import type { RecipientDataType } from "@/types/recipients";
import type { RemittanceMethod } from "@/types/remittanceMethod/RemittanceMethod";
import type { CountryAllowedCurrency } from "@/types/shared/countryAllowedCurrency";
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const CustomerRecipientStep: React.FC = () => {
  const navigate = useNavigate();
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");

  // Store state and actions
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const setCustomer = useSendRemittanceStore((state) => state.setCustomer);
  const setRecipient = useSendRemittanceStore((state) => state.setRecipient);
  const setSendCountry = useSendRemittanceStore(
    (state) => state.setSendCountry
  );
  const setReceiveCountry = useSendRemittanceStore(
    (state) => state.setReceiveCountry
  );
  const setRemittanceMethod = useSendRemittanceStore(
    (state) => state.setRemittanceMethod
  );
  const markStepCompleted = useSendRemittanceStore(
    (state) => state.markStepCompleted
  );
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);

  // API hooks
  const { data: customersData, isLoading: customersLoading } = useGetCustomers(
    customerSearchTerm ? `?search=${customerSearchTerm}` : undefined
  );

  // Only call useGetCustomerRecipients when we have a customer selected
  const { data: recipientsData, isLoading: recipientsLoading } =
    useGetCustomerRecipients(
      stepOne.customer?.id ? stepOne.customer.id.toString() : ""
    );

  const { data: sendCountriesData } = useGetSendingCurrencies(true);
  const { data: receiveCountriesData } = useGetReceivingCurrencies(false);

  const { data: remittanceMethodsData } = useRemittanceMethods();

  const searchRecipientMutation = useSearchRecipient();
  const attachRecipientMutation = useAttachRecipientToCustomer();

  // Memoized options
  const customerOptions = useMemo(
    () =>
      customersData?.data?.map((customer: CustomerType) => ({
        label: customer.full_name,
        value: customer.id,
      })) || [],
    [customersData]
  );

  const recipientOptions = useMemo(() => {
    const recipients = recipientsData as CustomerRecipient[] | undefined;
    return (
      recipients?.map((recipient: CustomerRecipient) => ({
        label: `${recipient.first_name} ${recipient.last_name}`,
        value: recipient.id,
      })) || []
    );
  }, [recipientsData]);

  const sendCountryOptions = useMemo(() => {
    return (
      sendCountriesData?.map((item: CountryAllowedCurrency) => ({
        label: item.country.name,
        value: item.country.id,
      })) || []
    );
  }, [sendCountriesData]);

  const receiveCountryOptions = useMemo(() => {
    return (
      receiveCountriesData?.map((item: CountryAllowedCurrency) => ({
        label: item.country.name,
        value: item.country.id,
      })) || []
    );
  }, [receiveCountriesData]);

  // Get recipient's remittance methods
  const remittanceMethodOptions = useMemo(() => {
    if (!stepOne.recipient || !remittanceMethodsData?.data) {
      return [];
    }

    // Since CustomerRecipient doesn't include remittance methods,
    // we'll show all available remittance methods for now
    // TODO: Filter based on recipient's country and available methods
    return remittanceMethodsData.data.map((method: RemittanceMethod) => ({
      label: method.name,
      value: method.id,
      description: method.description,
    }));
  }, [stepOne.recipient, remittanceMethodsData]);

  // Auto-validate step when all required fields are filled
  useEffect(() => {
    const stepIsValid =
      stepOne.customer &&
      stepOne.recipient &&
      stepOne.sendCountry &&
      stepOne.receiveCountry &&
      stepOne.remittanceMethod;

    if (stepIsValid) {
      markStepCompleted("customer");
    }
  }, [
    stepOne.customer,
    stepOne.recipient,
    stepOne.sendCountry,
    stepOne.receiveCountry,
    stepOne.remittanceMethod,
    markStepCompleted,
  ]);

  // Handler functions
  const handleCustomerSelect = (customerId: string | number) => {
    const customer = customersData?.data?.find(
      (c: CustomerType) => c.id.toString() === customerId.toString()
    );
    if (customer) {
      setRecipient(null);
      setReceiveCountry(null);

      setCustomer({
        id: parseInt(customer.id),
        firstName: customer.first_name,
        lastName: customer.last_name,
        fullName: customer.full_name,
        countryId: 0, // Will be updated when we set send country
        countryIso3: "",
        countryName: customer.country.name,
      });

      // Auto-set send country based on customer's country if available in allowed countries
      const customerCountryInAllowed = (
        sendCountriesData as CountryAllowedCurrency[]
      )?.find(
        (item: CountryAllowedCurrency) =>
          item.country.name === customer.country.name
      );
      if (customerCountryInAllowed) {
        setSendCountry({
          id:
            typeof customerCountryInAllowed.country.id === "string"
              ? parseInt(customerCountryInAllowed.country.id)
              : customerCountryInAllowed.country.id,
          name: customerCountryInAllowed.country.name,
          iso3: customerCountryInAllowed.country.iso3 || "",
        });
      }
    }
  };

  const handleRecipientSelect = (recipientId: string | number) => {
    const recipients = recipientsData as CustomerRecipient[] | undefined;
    const recipient = recipients?.find(
      (r: CustomerRecipient) => r.id.toString() === recipientId.toString()
    );
    if (recipient) {
      setRecipient({
        id: recipient.id,
        firstName: recipient.first_name,
        lastName: recipient.last_name,
        fullName: `${recipient.first_name} ${recipient.last_name}`,
        countryId: 0, // Will be updated when we set receive country
        countryIso3: "",
        countryName: "",
        countryPhoneCode: recipient.country_phone_code,
        phoneNumber: recipient.phone_number,
        email: recipient.email,
        address: {
          streetName: recipient.address.street || "",
          houseNumber: "", // Not available in current API response
          postalCode: recipient.address.postal_code || "",
          extraDetails: "", // Not available in current API response
          city: recipient.address.city?.name || "",
          state: recipient.address.state?.name || "",
          country: recipient.address.country?.name || "",
        },
      });

      // Auto-set receive country based on recipient's country if available in allowed countries
      if (recipient.address.country?.name) {
        const recipientCountryInAllowed = receiveCountriesData?.find(
          (item: CountryAllowedCurrency) =>
            item.country.name === recipient.address.country.name
        );
        if (recipientCountryInAllowed) {
          setReceiveCountry({
            id:
              typeof recipientCountryInAllowed.country.id === "string"
                ? parseInt(recipientCountryInAllowed.country.id)
                : recipientCountryInAllowed.country.id,
            name: recipientCountryInAllowed.country.name,
            iso3: recipientCountryInAllowed.country.iso3 || "",
          });
        }
      }
    }
  };

  const handleRecipientSearch = () => {
    if (recipientSearchTerm.trim() && stepOne.customer) {
      searchRecipientMutation.mutate({
        name: recipientSearchTerm.trim(),
      });
    }
  };

  const handleAttachRecipient = (recipientId: string | number) => {
    if (stepOne.customer) {
      attachRecipientMutation.mutate(
        {
          customerId: stepOne.customer.id.toString(),
          recipientId: recipientId.toString(),
        },
        {
          onSuccess: () => {
            // The mutation should automatically invalidate the customer recipients query
            console.log("Recipient attached successfully");
          },
          onError: (error) => {
            console.error("Failed to attach recipient:", error);
          },
        }
      );
    }
  };

  const handleCreateRecipient = () => {
    navigate(ROUTES.RECIPIENTS.CREATE_FORM);
  };

  const handleSendCountrySelect = (countryId: string | number) => {
    const countryItem = sendCountriesData?.find(
      (item: CountryAllowedCurrency) => item.country.id === countryId
    );
    if (countryItem) {
      setSendCountry({
        id:
          typeof countryItem.country.id === "string"
            ? parseInt(countryItem.country.id)
            : countryItem.country.id,
        name: countryItem.country.name,
        iso3: countryItem.country.iso3 || "",
      });
    }
  };

  const handleReceiveCountrySelect = (countryId: string | number) => {
    const countryItem = receiveCountriesData?.find(
      (item: CountryAllowedCurrency) =>
        item.country.id.toString() === countryId.toString()
    );
    if (countryItem) {
      setReceiveCountry({
        id:
          typeof countryItem.country.id === "string"
            ? parseInt(countryItem.country.id)
            : countryItem.country.id,
        name: countryItem.country.name,
        iso3: countryItem.country.iso3 || "",
      });
    }
  };

  const handleRemittanceMethodSelect = (methodId: string | number) => {
    const method = remittanceMethodsData?.data?.find(
      (m: RemittanceMethod) => m.id.toString() === methodId.toString()
    );
    if (method) {
      setRemittanceMethod({
        id: method.id,
        name: method.name,
        description: method.description,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Customer/Sender and Recipient Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer/Sender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Customer/Sender
          </label>
          <SearchableSelect
            options={customerOptions}
            value={stepOne.customer?.id || ""}
            onChange={handleCustomerSelect}
            placeholder="Select an existing customer"
            loading={customersLoading}
            enableBackendSearch={true}
            onSearch={setCustomerSearchTerm}
          />
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Recipient
            </label>
            <button
              onClick={handleCreateRecipient}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium underline cursor-pointer"
            >
              CREATE A RECIPIENT
            </button>
          </div>
          <SearchableSelect
            options={recipientOptions}
            value={stepOne.recipient?.id || ""}
            onChange={handleRecipientSelect}
            placeholder="Select an existing recipient"
            loading={recipientsLoading}
            disabled={!stepOne.customer}
            enableBackendSearch={false}
          />

          {/* Expandable Text Section - Search recipients from other customers */}
          {stepOne.customer && (
            <div className="mt-2">
              <button
                onClick={() => setIsExpandedText(!isExpandedText)}
                className="w-full text-left flex"
              >
                <span className="text-sm text-gray-600 underline cursor-pointer">
                  Search recipient for another customer and add it to the
                  selected customer
                </span>
                {isExpandedText ? (
                  <ChevronUpIcon className="ml-2 h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                )}
              </button>

              {isExpandedText && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recipientSearchTerm}
                        onChange={(e) => setRecipientSearchTerm(e.target.value)}
                        placeholder="Search recipient by name or phone..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleRecipientSearch();
                          }
                        }}
                      />
                      <Button
                        onClick={handleRecipientSearch}
                        disabled={
                          !recipientSearchTerm.trim() ||
                          searchRecipientMutation.isPending
                        }
                      >
                        <Search className="h-4 w-4" />
                        {searchRecipientMutation.isPending
                          ? "Searching..."
                          : "Search"}
                      </Button>
                    </div>
                  </div>

                  {/* Show search results */}
                  {searchRecipientMutation.data?.data &&
                  searchRecipientMutation.data.data.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Search Results:
                      </p>
                      {searchRecipientMutation.data.data.map(
                        (recipient: RecipientDataType) => (
                          <div
                            key={recipient.id}
                            className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-gray-100"
                          >
                            <div>
                              <span className="font-medium">
                                {recipient.first_name} {recipient.last_name}
                              </span>
                              <span className="text-gray-500 ml-2">
                                - {recipient.phone_number}
                              </span>
                            </div>
                            {recipientOptions.some(
                              (r) => r.value === recipient.id
                            ) ? (
                              <span className="text-green-600 text-sm font-medium">
                                Already Attached
                              </span>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-teal-600 text-sm hover:text-teal-700 px-3 py-1 border border-teal-600 rounded-md hover:bg-teal-50"
                                onClick={() =>
                                  handleAttachRecipient(recipient.id)
                                }
                                disabled={attachRecipientMutation.isPending}
                              >
                                {attachRecipientMutation.isPending
                                  ? "Adding..."
                                  : "Add"}
                              </Button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : searchRecipientMutation.data?.data &&
                    searchRecipientMutation.data.data.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-3">
                      No recipients found. Try a different search term.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-3">
                      Enter a search term and click "Search" to find recipients
                      from other customers.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Send and Receive Countries - User can select any country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sending Country */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sending Country
          </label>
          <SearchableSelect
            options={sendCountryOptions}
            value={stepOne.sendCountry?.id || ""}
            onChange={handleSendCountrySelect}
            placeholder="Select sending country"
            loading={false}
          />
        </div>

        {/* Receiving Country */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Receiving Country
          </label>
          <SearchableSelect
            options={receiveCountryOptions}
            value={stepOne.receiveCountry?.id || ""}
            onChange={handleReceiveCountrySelect}
            placeholder="Select receiving country"
            loading={false}
          />
        </div>
      </div>

      {/* Recipient's Remittance Methods */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Recipient's Remittance Methods
        </label>
        <SearchableSelect
          options={remittanceMethodOptions}
          value={stepOne.remittanceMethod?.id || ""}
          onChange={handleRemittanceMethodSelect}
          placeholder="Select recipient remittance methods"
          disabled={!stepOne.recipient}
        />
      </div>

      {/* Step Validation Info */}
      {isStepValid("customer") && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-sm text-green-800 font-medium flex items-center gap-1 rounded-md">
          <CheckedIcon />{" "}
          <span> Step completed! You can now proceed to the next step.</span>
        </div>
      )}
    </div>
  );
};

export default CustomerRecipientStep;
