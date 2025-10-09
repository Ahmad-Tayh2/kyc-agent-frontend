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
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import {
  useAttachRecipientToCustomer,
  useGetCustomers,
} from "@/hooks/data/useCustomers";

interface SearchFormData {
  name: string;
  phone_number: string;
  customer_id: string;
}

const RecipientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    name: "",
    phone_number: "",
    customer_id: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { mutateAsync: searchRecipient, isPending: isSearching } =
    useSearchRecipient();
  const { mutateAsync: attachRecipientToCustomer } =
    useAttachRecipientToCustomer();
  const attachRecipient = useCallback(
    (recipientId: string | number) => {
      attachRecipientToCustomer({
        customerId: searchForm.customer_id,
        recipientId,
      });
    },
    [searchForm.customer_id]
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
    })),
  ];

  const handleSearch = async () => {
    if (!searchForm.phone_number && !searchForm.name) {
      return;
    }

    try {
      const result = await searchRecipient({
        name: searchForm.name || undefined,
        phone_number: searchForm.phone_number || undefined,
        customer_id: searchForm.customer_id || undefined,
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
    navigate(ROUTES.RECIPIENTS.CREATE_FORM);
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
          <span> You can add an existing recipient of other </span>
          <b>agents / customers</b>{" "}
          <span>by searching them in our database.</span>
        </div>
        <div className="p-5">
          <div className="">
            <SingleSelectDropdown
              label="Adding Recipient to the following Customer"
              placeholder="Select a customer"
              options={customersOptions}
              selectedValue={searchForm.customer_id}
              onValueChange={(value: string) =>
                handleInputChange("customer_id", value)
              }
              required
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
                  />
                </div>

                <div className="text-gray-500 mb-3">or</div>

                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <Label htmlFor="phone_number" className="text-[14px]">
                    Phone number
                  </Label>
                  <Input
                    type="number"
                    id="phone_number"
                    placeholder="Enter your phone number"
                    value={searchForm.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                  />
                </div>

                <ActionButton
                  onClick={handleSearch}
                  disabled={
                    isSearching ||
                    !(searchForm.name || searchForm.phone_number) || //must fill one of the two fields
                    !searchForm.customer_id //must select a customer
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
