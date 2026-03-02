import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import SearchableSelect from "@/components/ui/searchable-select";
import { ROUTES } from "@/constants/routes";
import {
  useAttachRecipientToCustomer,
  useGetCustomerRecipients,
  useInfiniteActiveCustomers,
} from "@/hooks/data/useCustomers";
import { useInfiniteRecipients } from "@/hooks/data/useRecipients";
import {
  useReceiveCountries,
  useSendCountries,
  useRecipientMethods,
} from "@/hooks/data/useRemittanceAvailability";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import type { CustomerType } from "@/types/customers";
import type { CustomerRecipient } from "@/types/customers/recipients";
import type { RecipientDataType } from "@/types/recipients";

import type {
  RemittanceCountry,
  RemittanceMethodAvailability,
  RecipientPayoutAgent,
} from "@/types/remittanceAvailability";
import { ChevronDownIcon, ChevronUpIcon, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

interface CustomerRecipientStepProps {
  customerId?: string | null;
  recipientId?: string | null;
  isReadOnly?: boolean;
}

const CustomerRecipientStep = (props: CustomerRecipientStepProps) => {
  const { customerId, recipientId } = props;
  const navigate = useNavigate();
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [activeCustomerSearchTerm, setActiveCustomerSearchTerm] = useState(""); // The actual search term used for API
  const [hasCustomerSearched, setHasCustomerSearched] = useState(false); // Track if search button was clicked
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState(""); // The actual search term used for API
  const [hasSearched, setHasSearched] = useState(false); // Track if search button was clicked
  const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] =
    useState(false);

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
  const setPayoutAgent = useSendRemittanceStore(
    (state) => state.setPayoutAgent
  );
  const setSelectedPaymentMethodType = useSendRemittanceStore(
    (state) => state.setSelectedPaymentMethodType
  );
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);
  const mode = useSendRemittanceStore((state) => state.mode);

  // API hooks - Infinite scroll for customers
  const {
    data: customersInfiniteData,
    fetchNextPage: fetchNextCustomersPage,
    hasNextPage: hasNextCustomersPage,
    isFetchingNextPage: isFetchingNextCustomersPage,
    isLoading: customersLoading,
  } = useInfiniteActiveCustomers(
    activeCustomerSearchTerm,
    hasCustomerSearched || !customerId // Enable when searched or no default customer
  );

  // Only call useGetCustomerRecipients when we have a customer selected
  const { data: recipientsResponse, isLoading: recipientsLoading } =
    useGetCustomerRecipients(
      stepOne.customer?.id ? stepOne.customer.id.toString() : ""
    );

  const recipientsData = useMemo(() => {
    return recipientsResponse?.data || [];
  }, [recipientsResponse?.data]);

  // Use new remittance availability endpoints for countries
  const { data: sendCountriesData } = useSendCountries();
  const { data: receiveCountriesData } = useReceiveCountries();

  // Use new recipient methods endpoint that combines remittance methods and payout agents
  // Only fetches when BOTH recipient and receive country are selected
  const { data: recipientMethodsData } = useRecipientMethods(
    stepOne.recipient?.id || null,
    stepOne.receiveCountry?.id || null
  );

  // Infinite scroll for recipient search - only enabled after search button is clicked
  const {
    data: searchRecipientsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSearching,
  } = useInfiniteRecipients(
    activeSearchTerm,
    hasSearched && isExpandedText && !!stepOne.customer
  );

  const attachRecipientMutation = useAttachRecipientToCustomer();

  // Refs for infinite scroll observers
  const customerObserverTarget = useRef<HTMLDivElement>(null);
  const recipientObserverTarget = useRef<HTMLDivElement>(null);

  // Flatten paginated customers data
  const customersData = useMemo(() => {
    if (!customersInfiniteData?.pages) return { data: [] };
    const allCustomers = customersInfiniteData.pages.flatMap(
      (page) => page.data || []
    );
    return { data: allCustomers };
  }, [customersInfiniteData]);

  // Flatten paginated search results
  const searchedRecipients = useMemo(() => {
    if (!searchRecipientsData?.pages) return [];
    return searchRecipientsData.pages.flatMap((page) => page.data || []);
  }, [searchRecipientsData]);

  // Infinite scroll observer effect for recipients
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = recipientObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Infinite scroll observer effect for customers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextCustomersPage &&
          !isFetchingNextCustomersPage
        ) {
          fetchNextCustomersPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = customerObserverTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    hasNextCustomersPage,
    isFetchingNextCustomersPage,
    fetchNextCustomersPage,
  ]);

  const customerOptions = useMemo(() => {
    //if there is a default customer, it should not be changed
    if (stepOne?.customer?.id && customerId) {
      return [
        {
          label: `${stepOne?.customer.firstName} ${stepOne?.customer.lastName}`,
          value: stepOne?.customer?.id,
        },
      ];
    }
    //if there is a default recipient, we should chow the recipient customers onlly
    if (stepOne?.recipient?.id && recipientId) {
      return (
        stepOne?.recipient?.customers?.map((customer) => ({
          label: customer.full_name,
          value: customer.id,
        })) || []
      );
    }
    //normal case
    return (
      customersData?.data?.map((customer: CustomerType) => ({
        label: customer.full_name,
        value: customer.id,
      })) || []
    );
  }, [
    customersData,
    customerId,
    stepOne?.recipient?.id,
    recipientId,
    stepOne?.customer?.id,
  ]);

  const recipientOptions = useMemo(() => {
    //if there is a default recipient we should not should anyone else
    if (stepOne?.recipient?.id && recipientId) {
      return [
        {
          label: `${stepOne?.recipient.firstName} ${stepOne?.recipient.lastName}`,
          value: stepOne?.recipient?.id,
        },
      ];
    }
    //normal case
    const recipients = recipientsData as CustomerRecipient[] | undefined;
    return (
      recipients?.map((recipient: CustomerRecipient) => ({
        label: `${recipient.first_name} ${recipient.last_name}`,
        value: recipient.id,
      })) || []
    );
  }, [recipientsData, stepOne?.recipient?.id, recipientId]);

  const sendCountryOptions = useMemo(() => {
    return (
      sendCountriesData?.map((item: RemittanceCountry) => ({
        label: item.name,
        value: item.id,
      })) || []
    );
  }, [sendCountriesData]);

  const receiveCountryOptions = useMemo(() => {
    return (
      receiveCountriesData?.map((item: RemittanceCountry) => ({
        label: item.name,
        value: item.id,
      })) || []
    );
  }, [receiveCountriesData]);

  // Get recipient's payment methods (remittance methods + payout agents)
  const paymentMethodOptions = useMemo(() => {
    if (
      !stepOne.recipient ||
      !stepOne.receiveCountry ||
      !recipientMethodsData
    ) {
      return [];
    }

    const options: Array<{ label: string; value: string }> = [];

    // Filter out "cash pickup" methods (case insensitive)
    const filteredRemittanceMethods =
      recipientMethodsData.remittance_methods?.filter(
        (rm: RemittanceMethodAvailability) =>
          !rm.name.toLowerCase().includes("cash pickup") &&
          !rm.description.toLowerCase().includes("cash pickup")
      ) || [];

    // Add Remittance Methods (with RM prefix for clarity)
    // Only add if there are methods other than "cash pickup"
    if (filteredRemittanceMethods.length > 0) {
      filteredRemittanceMethods.forEach((rm: RemittanceMethodAvailability) => {
        options.push({
          label: `Wallet: ${rm.name}`,
          value: `rm_${rm.id}`,
        });
      });
    }

    // Add Payout Agents (with Payout prefix for clarity)
    if (
      recipientMethodsData.payout_agents &&
      recipientMethodsData.payout_agents.length > 0
    ) {
      recipientMethodsData.payout_agents.forEach(
        (payout: RecipientPayoutAgent) => {
          options.push({
            label: `Cash Pickup: ${payout.payout_agent_business_name}`,
            value: `payout_${payout.payout_agent_id}`,
          });
        }
      );
    }
    return options;
  }, [stepOne.recipient, stepOne.receiveCountry, recipientMethodsData]);

  useEffect(() => {
    if (stepOne?.customer?.id) {
      const customer = customersData?.data?.find(
        (c: CustomerType) =>
          c.id.toString() === stepOne?.customer?.id.toString()
      );
      if (customer) {
        // Auto-set send country based on customer's country if available in allowed countries
        const customerCountryInAllowed = sendCountriesData?.find(
          (item: RemittanceCountry) => item.name === customer.country.name
        );
        if (customerCountryInAllowed) {
          setSendCountry({
            id:
              typeof customerCountryInAllowed.id === "string"
                ? parseInt(customerCountryInAllowed.id)
                : customerCountryInAllowed.id,
            name: customerCountryInAllowed.name,
            iso3: customerCountryInAllowed.iso3 || "",
          });
        }
      }
    }
  }, [stepOne.customer, customersData, sendCountriesData, setSendCountry]);

  // Handler functions
  const handleCustomerSelect = (customerId: string | number) => {
    const customer = customersData?.data?.find(
      (c: CustomerType) => c.id.toString() === customerId.toString()
    );
    if (customer) {
      // reset the recipient if there is not a default one
      if (!recipientId) {
        setRecipient(null);
        setReceiveCountry(null);
      }

      setCustomer({
        id: parseInt(customer.id),
        firstName: customer.first_name,
        lastName: customer.last_name,
        fullName: customer.full_name,
        countryId: 0, // Will be updated when we set send country
        countryIso3: "",
        countryName: customer.country.name,
      });
    }
  };
  // Auto-select customer when there's only one option and no customer is selected yet
  const hasAutoSelectedCustomer = useRef(false);
  useEffect(() => {
    if (
      customerOptions?.length === 1 &&
      !stepOne.customer?.id &&
      !hasAutoSelectedCustomer.current
    ) {
      hasAutoSelectedCustomer.current = true;
      handleCustomerSelect(customerOptions[0]?.value);
    }
  }, [customerOptions]);
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
        customers: recipient?.customers,
      });

      // Auto-set receive country based on recipient's country if available in allowed countries
      if (recipient.address.country?.name) {
        const recipientCountryInAllowed = receiveCountriesData?.find(
          (item: RemittanceCountry) =>
            item.name === recipient.address.country.name
        );
        if (recipientCountryInAllowed) {
          setReceiveCountry({
            id:
              typeof recipientCountryInAllowed.id === "string"
                ? parseInt(recipientCountryInAllowed.id)
                : recipientCountryInAllowed.id,
            name: recipientCountryInAllowed.name,
            iso3: recipientCountryInAllowed.iso3 || "",
          });
        }
      }
    }
  };

  const handleRecipientSearch = () => {
    if (recipientSearchTerm.trim() && stepOne.customer) {
      setActiveSearchTerm(recipientSearchTerm.trim());
      setHasSearched(true);
    }
  };

  const handleAttachRecipient = (recipientId: string | number) => {
    if (stepOne.customer) {
      attachRecipientMutation.mutate(
        {
          customer_id: stepOne.customer.id.toString(),
          recipient_id: recipientId.toString(),
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
      (item: RemittanceCountry) => item.id === countryId
    );
    if (countryItem) {
      setSendCountry({
        id:
          typeof countryItem.id === "string"
            ? parseInt(countryItem.id)
            : countryItem.id,
        name: countryItem.name,
        iso3: countryItem.iso3 || "",
      });
    }
  };

  const handleReceiveCountrySelect = (countryId: string | number) => {
    const countryItem = receiveCountriesData?.find(
      (item: RemittanceCountry) => item.id.toString() === countryId.toString()
    );
    if (countryItem) {
      setReceiveCountry({
        id:
          typeof countryItem.id === "string"
            ? parseInt(countryItem.id)
            : countryItem.id,
        name: countryItem.name,
        iso3: countryItem.iso3 || "",
      });
    }
  };

  const handlePaymentMethodSelect = (methodId: string | number) => {
    const methodValue = methodId.toString();

    if (!recipientMethodsData) return;

    if (methodValue.startsWith("rm_")) {
      // Handle remittance method selection
      const rmMethodId = parseInt(methodValue.replace("rm_", ""));
      const rm = recipientMethodsData.remittance_methods?.find(
        (r: RemittanceMethodAvailability) => r.id === rmMethodId
      );

      if (rm) {
        setRemittanceMethod({
          id: rm.id,
          name: rm.name,
          type: "remittance_method",
        });
        // Clear payout agent
        setPayoutAgent(null);
        setSelectedPaymentMethodType("remittance_method");
      }
    } else if (methodValue.startsWith("payout_")) {
      // Handle payout agent selection
      const payoutAgentId = parseInt(methodValue.replace("payout_", ""));
      const payout = recipientMethodsData.payout_agents?.find(
        (p: RecipientPayoutAgent) => p.payout_agent_id === payoutAgentId
      );

      if (payout) {
        setPayoutAgent({
          id: payout.payout_agent_id,
          name: payout.payout_agent_business_name,
          business_name: payout.payout_agent_business_name,
          type: "payout_agent",
        });
        // Clear remittance method
        setRemittanceMethod(null);
        setSelectedPaymentMethodType("payout_agent");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-auto">
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
            onSearch={(term) => {
              setActiveCustomerSearchTerm(term);
              setHasCustomerSearched(true);
            }}
            onLoadMore={fetchNextCustomersPage}
            hasMore={hasNextCustomersPage}
            isLoadingMore={isFetchingNextCustomersPage}
            disabled={mode === "edit" || !!customerId} //when we are in edit mode or there is a default customer
          />
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Recipient
            </label>
            {!recipientId && (
              <button
                onClick={handleCreateRecipient}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium underline cursor-pointer"
              >
                CREATE A RECIPIENT
              </button>
            )}
          </div>
          <SearchableSelect
            options={recipientOptions}
            value={stepOne.recipient?.id || ""}
            onChange={handleRecipientSelect}
            placeholder="Select an existing recipient"
            loading={recipientsLoading}
            disabled={!stepOne.customer || !!recipientId}
            enableBackendSearch={false}
          />

          {/* Expandable Text Section - Search recipients from other customers */}
          {stepOne.customer && !recipientId && (
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
                    <div className="flex flex-row gap-2 flex-wrap">
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
                        disabled={!recipientSearchTerm.trim() || isSearching}
                      >
                        <Search className="h-4 w-4" />

                        {isSearching ? "Searching..." : "Search"}
                      </Button>
                    </div>
                  </div>

                  {/* Show search results with infinite scroll */}
                  {searchedRecipients.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-600 font-medium sticky top-0 bg-white py-2">
                        Search Results ({searchedRecipients.length}):
                      </p>
                      {searchedRecipients.map(
                        (recipient: RecipientDataType) => (
                          <div
                            key={recipient.id}
                            className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100"
                          >
                            <div>
                              <span className="font-medium">
                                {recipient.first_name} {recipient.last_name}
                              </span>
                              <span className="text-gray-500 ml-2 font-sm">
                                - (+{recipient.country_phone_code}){" "}
                                {recipient.phone_number}
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
                      {/* Infinite scroll trigger element */}
                      <div ref={recipientObserverTarget} className="h-4" />
                      {/* Loading indicator for next page */}
                      {isFetchingNextPage && (
                        <div className="flex justify-center py-2">
                          <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                        </div>
                      )}
                    </div>
                  ) : hasSearched &&
                    searchedRecipients.length === 0 &&
                    !isSearching ? (
                    <p className="text-sm text-gray-500 text-center py-3">
                      No recipients found. Try a different search term.
                    </p>
                  ) : !hasSearched ? (
                    <p className="text-sm text-gray-500 text-center py-3">
                      Enter a search term and click "Search" to find recipients
                      from other customers.
                    </p>
                  ) : null}
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
            disabled={mode === "edit"}
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

      {/* Recipient's Payment Methods */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Recipient's Payment Methods
        </label>
        <SearchableSelect
          options={paymentMethodOptions}
          value={
            stepOne.selectedPaymentMethodType === "remittance_method" &&
            stepOne.remittanceMethod
              ? `rm_${stepOne.remittanceMethod.id}`
              : stepOne.selectedPaymentMethodType === "payout_agent" &&
                stepOne.payoutAgent
              ? `payout_${stepOne.payoutAgent.id}`
              : ""
          }
          onChange={handlePaymentMethodSelect}
          placeholder="Select recipient payment method"
          disabled={!stepOne.recipient}
        />

        {/* Add Payment Method Button */}
        {stepOne.recipient && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsAddPaymentMethodModalOpen(true)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium underline cursor-pointer"
            >
              + Add New Payment Method for Recipient
            </button>
          </div>
        )}
      </div>

      {/* Step Validation Info */}
      {isStepValid("customer") && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-sm text-green-800 font-medium flex items-center gap-1 rounded-md">
          <CheckedIcon />{" "}
          <span> Step completed! You can now proceed to the next step.</span>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {isAddPaymentMethodModalOpen && (
        <AddPaymentMethodModal
          isOpen={isAddPaymentMethodModalOpen}
          onClose={() => setIsAddPaymentMethodModalOpen(false)}
          recipientId={stepOne.recipient?.id || 0}
          receiveCountryId={stepOne.receiveCountry?.id || null}
          onMethodAdded={() => {
            setIsAddPaymentMethodModalOpen(false);
            // The TanStack Query cache will automatically refresh the data
          }}
        />
      )}
    </div>
  );
};

export default CustomerRecipientStep;
