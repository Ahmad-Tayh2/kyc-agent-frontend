import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { useSearchCustomer } from "@/hooks/data/useCustomers";
import { searchCustomerColumns } from "@/components/customers/CustomerTableColumns";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";
import SearchNotFound from "@/components/shared/SearchNotFound";
import { useAttachCustomerToAgent } from "@/hooks/data/useAgent";
import PhoneInput from "@/components/shared/PhoneInput";
import { useCountries } from "@/hooks/data/useAddress";

interface SearchFormData {
  // customerNumber: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
}

const CustomerCreatePage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    // customerNumber: "",
    email: "",
    phoneNumber: "",
    phoneCode: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { mutateAsync: searchCustomer, isPending: isSearching } =
    useSearchCustomer();
  const { data: countries = [] } = useCountries();

  const { mutateAsync: attachCustomerToAgent } = useAttachCustomerToAgent();
  useEffect(() => {
    console.log("searchForm = = ", searchForm);
  }, [searchForm]);
  const handleAttachCustomerToAgent = async (customerId: number | string) => {
    console.log(" customerId = ", customerId);
    const result = await attachCustomerToAgent(customerId);
    if (result?.status) {
      setSearchResults((prev: any[]) => {
        let updatedData: any[] = [];
        if (prev?.length > 0) {
          for (let customer of prev) {
            if (customer?.id === customerId) {
              updatedData?.push({
                ...customer,
                belongs_to_current_agent: true,
              });
            } else updatedData?.push(customer);
          }
        }
        return updatedData;
      });
    }
  };
  const columns = searchCustomerColumns(handleAttachCustomerToAgent);
  const isSearchDisabled = useMemo(() => {
    return !searchForm?.email && !searchForm?.phoneNumber;
  }, [searchForm]);
  const handleSearch = async () => {
    if (isSearchDisabled) {
      return;
    }

    try {
      const result = await searchCustomer({
        // customerNumber: searchForm.customerNumber || undefined,
        email: searchForm.email || undefined,
        phoneNumber: searchForm.phoneNumber || undefined,
        phoneCode: searchForm.phoneCode || undefined,
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
    navigate(ROUTES.CUSTOMERS.CREATE_FORM);
  };

  const handleBack = () => {
    navigate(ROUTES.CUSTOMERS.LIST);
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Country phone code options
  const countryPhoneOptions = countries?.map((country: any) => {
    return {
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    };
  });
  // const customerNotFound = hasSearched && searchResults.length === 0;
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
        <PageTitle title={"Add New Customer"} />
      </div>
      {/* Search Form */}
      <div className="bg-white rounded-lg border ">
        <div className="p-6 border-b-1">
          {/* You can add an existing customer of other agents by searching them. */}
          First, search for the customer. If none are found, create a new
          record.
        </div>
        <div className="flex items-end gap-4 flex-wrap p-6">
          {/* <div className="flex-1 min-w-[200px] flex flex-col gap-1">
            <Label htmlFor="customerNumber">Customer number</Label>
            <Input
              id="customerNumber"
              placeholder="Enter customer number"
              value={searchForm.customerNumber}
              onChange={(e) =>
                handleInputChange("customerNumber", e.target.value)
              }
            />
          </div>

          <div className="text-gray-500 mb-3">or</div> */}
          <div className="flex-1 min-w-[200px] flex flex-col gap-1">
            <Label htmlFor="email" className="text-[14px]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={searchForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="text-gray-500 mb-3">or</div>
          <div className="flex-1 min-w-[200px] flex flex-col gap-1">
            <Label htmlFor="phoneNumber" className="text-[14px]">
              Phone number
            </Label>
            <PhoneInput
              placeholder="Enter your phone number"
              countryOptions={countryPhoneOptions || []}
              selectedCountry={searchForm.phoneCode}
              phoneNumber={searchForm.phoneNumber}
              onCountryChange={(phoneCode) => {
                handleInputChange("phoneCode", phoneCode);
                // Clear the phone number when country changes to let the PhoneInput component handle it
                handleInputChange("phoneNumber", "");
              }}
              onPhoneChange={(phoneNumber) =>
                handleInputChange("phoneNumber", phoneNumber)
              }
            />
            {/* <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={searchForm.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            /> */}
          </div>
          <ActionButton
            onClick={handleSearch}
            buttonProps={{
              disabled: isSearching,
            }}
            className="bg-teal-600 hover:bg-teal-700"
            title="search"
            disabled={isSearchDisabled}
          />
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
                  title="create new customer"
                  icon={<AddCustomerIcon />}
                  onClick={handleCreateNew}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <SearchNotFound
                description="A customer is Not Found with the Provided Search Criteria."
                actionButton={{
                  title: "create new customer",
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

export default CustomerCreatePage;
