import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { useSearchRecipient } from "@/hooks/data/useRecipients";
import { recipientsSearchColumns } from "@/components/recipients/RecipientsTableColumns";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";
import SearchNotFound from "@/components/shared/SearchNotFound";
import {
  useAttachRecipientToCustomer,
  useGetCustomers,
} from "@/hooks/data/useCustomers";
import { toast } from "sonner";
import PhoneInput from "@/components/shared/PhoneInput";
import { useCountries } from "@/hooks/data/useAddress";
import { useAuthStore } from "@/store/authStore";
import { SingleSearchableSelect } from "@/components/shared/SingleSearchableSelect";

interface SearchFormData {
  name: string;
  phone_number: string;
  customer_id: string;
  phone_code?: string;
}

const RecipientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    name: "",
    phone_number: "",
    customer_id: "",
    phone_code: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { mutateAsync: searchRecipient, isPending: isSearching } =
    useSearchRecipient();
  const { mutateAsync: attachRecipientToCustomer } =
    useAttachRecipientToCustomer();
  const { data: countries = [] } = useCountries();
  const { user } = useAuthStore();
  const attachRecipient = useCallback(
    async (recipientId: string | number) => {
      let payloadToSend: {
        recipient_id: string | number;
        agent_id?: string;
        customer_id?: string;
      } = {
        recipient_id: recipientId,
      };
      if (searchForm?.customer_id === "agent_id") {
        payloadToSend = {
          ...payloadToSend,
          agent_id: user?.agent?.id,
        };
      } else {
        payloadToSend = {
          ...payloadToSend,
          customer_id: searchForm?.customer_id,
        };
      }
      const result = await attachRecipientToCustomer(payloadToSend);
      if (result?.status) {
        setSearchResults((prev: any[]) => {
          let updatedData: any[] = [];
          if (prev?.length > 0) {
            for (let recipient of prev) {
              if (recipient?.id === recipientId) {
                updatedData?.push({
                  ...recipient,
                  attachment_info: {
                    ...recipient.attachment_info,
                    is_attached: true,
                  },
                });
              } else updatedData.push(recipient);
            }
          }
          return updatedData;
        });
        toast.success("Recipient attached to customer successfully!");
      } else {
        toast.error(result?.message);
      }
    },
    [searchForm.customer_id],
  );

  const columns = recipientsSearchColumns({
    attachRecipient,
  });
  const { data: CustomersResponse } = useGetCustomers();

  const customersData = useMemo(() => {
    return CustomersResponse?.data || [];
  }, [CustomersResponse?.data]);
  const customersOptions = [
    ...customersData?.map((customer: any) => ({
      label: customer.full_name,
      value: customer.id,
      name: "customer_id",
    })),
  ];
  const isSearchDisabled = useMemo(() => {
    return !searchForm?.phone_number && !searchForm?.name;
  }, [searchForm]);
  const handleSearch = async () => {
    if (isSearchDisabled) {
      return;
    }
    try {
      const result = await searchRecipient({
        name: searchForm.name || undefined,
        phone_number: searchForm.phone_number || undefined,
        phone_code: searchForm.phone_code || undefined,
        customer_id:
          searchForm.customer_id && searchForm.customer_id !== "agent_id"
            ? searchForm.customer_id
            : undefined,
        agent_id:
          user?.agent?.id &&
          searchForm.customer_id &&
          searchForm.customer_id === "agent_id"
            ? user?.agent?.id
            : undefined,
      });

      setSearchResults(result.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  const handleCreateNew = () => {
    if (user?.agent?.id && searchForm?.customer_id === "agent_id") {
      navigate(ROUTES.RECIPIENTS.CREATE_FORM + `?customer=myself`);
    } else if (searchForm?.customer_id) {
      navigate(
        ROUTES.RECIPIENTS.CREATE_FORM + `?customer=${searchForm.customer_id}`,
      );
    }
  };

  const handleBack = () => {
    navigate(ROUTES.RECIPIENTS.LIST);
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const countryPhoneOptions = countries?.map((country: any) => {
    return {
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    };
  });
  const extraOption = {
    label: `${user?.first_name} ${user?.last_name} (Myself)`,
    value: "agent_id",
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-start items-center gap-3">
        <button
          onClick={handleBack}
          className="text-primary top-1 cursor-pointer"
        >
          <BackArrowIcon width={30} height={30} />
        </button>
        <PageTitle title={"Add New Recipient"} />
      </div>
      {/* Search Form */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b-1">
          <div>
            First, search for the recipient. If none are found, create a new
            record.
          </div>
          <div>
            <span>You can also add an existing recipient of other </span>
            <b>agents / customers</b>{" "}
            <span>by searching them in our database.</span>
          </div>
        </div>
        <div className="p-5">
          <div className="">
            {/* <SingleSelectDropdown
              label="Adding Recipient to the following Customer"
              placeholder="Select a customer"
              options={customersOptions}
              extraOption={extraOption}
              selectedValue={searchForm.customer_id}
              onValueChange={(value: string) => {
                handleInputChange("customer_id", value);
              }}
              required
            /> */}
            <SingleSearchableSelect
              label="Adding Recipient to the following Customer"
              placeholder="Select a customer"
              required
              options={customersOptions}
              extraOption={extraOption}
              value={searchForm.customer_id}
              onChange={(value: string) => {
                handleInputChange("customer_id", value);
              }}
            />
          </div>
          {searchForm.customer_id && (
            <div className="flex flex-col gap-3 pt-5 mt-5 border-t-1 border-gray-200">
              <div>Search Existing Recipients</div>
              <div className="flex items-end gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <Label htmlFor="name">Recipient name</Label>
                  <Input
                    id="name"
                    placeholder="Enter recipient name"
                    value={searchForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!!searchForm.phone_number}
                  />
                </div>

                <div className="text-gray-500 mb-3">or</div>

                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <Label htmlFor="phone_number" className="text-[14px]">
                    Phone number
                  </Label>
                  <PhoneInput
                    placeholder="Enter your phone number"
                    countryOptions={countryPhoneOptions || []}
                    selectedCountry={searchForm.phone_code}
                    phoneNumber={searchForm.phone_number}
                    onCountryChange={(phoneCode) => {
                      handleInputChange("phone_code", phoneCode);
                      // Clear the phone number when country changes to let the PhoneInput component handle it
                      handleInputChange("phone_number", "");
                    }}
                    onPhoneChange={(phoneNumber) =>
                      handleInputChange("phone_number", phoneNumber)
                    }
                    disabled={!!searchForm.name}
                  />
                  {/* <Input
                    type="number"
                    id="phone_number"
                    placeholder="Enter your phone number"
                    value={searchForm.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                  /> */}
                </div>

                <ActionButton
                  onClick={handleSearch}
                  disabled={
                    isSearching || isSearchDisabled || !searchForm.customer_id //must select a customer
                  }
                  className="bg-teal-600 hover:bg-teal-700"
                  title="search"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Search Results:</h2>

          {searchResults.length > 0 ? (
            <div>
              <div className="bg-white rounded-lg border">
                <DataTable
                  data={searchResults}
                  columns={columns}
                  isLoading={false}
                />
              </div>
              <div className="p-5 flex items-center justify-center">
                <ActionButton
                  title="create new recipient"
                  icon={<AddCustomerIcon />}
                  onClick={handleCreateNew}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <SearchNotFound
                description="A recipient is Not Found with the Provided Search Criteria."
                actionButton={{
                  title: "create new recipient",
                  icon: <AddCustomerIcon />,
                  onClick: handleCreateNew,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipientCreatePage;
