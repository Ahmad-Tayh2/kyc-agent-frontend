import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { useSearchCustomer } from "@/hooks/useCustomerCreation";
import { useCustomerColumns } from "@/components/customers/CustomerTableColumns";
import { ROUTES } from "@/constants/routes";
import { Search, UserPlus } from "lucide-react";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/PageTitle";
import ActionButton from "@/components/ActionButton";

interface SearchFormData {
  customerNumber: string;
  email: string;
  phoneNumber: string;
}

const CustomerCreatePage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    customerNumber: "",
    email: "",
    phoneNumber: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { mutateAsync: searchCustomer, isPending: isSearching } =
    useSearchCustomer();
  const columns = useCustomerColumns();

  const handleSearch = async () => {
    if (
      !searchForm.customerNumber &&
      !searchForm.email &&
      !searchForm.phoneNumber
    ) {
      return;
    }

    try {
      const result = await searchCustomer({
        customerNumber: searchForm.customerNumber || undefined,
        email: searchForm.email || undefined,
        phoneNumber: searchForm.phoneNumber || undefined,
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
    navigate(ROUTES.CUSTOMER_CREATE + "/form");
  };

  const handleBack = () => {
    navigate(ROUTES.CUSTOMERS);
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        <div className="p-6  border-b-1">
          You can add an existing customer of other agents by searching them.
        </div>
        <div className="flex items-end gap-4 flex-wrap p-6">
          <div className="flex-1 min-w-[200px] flex flex-col gap-1">
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

          <div className="text-gray-500 mb-3">or</div>

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
            <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={searchForm.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>

          <ActionButton
            onClick={handleSearch}
            buttonProps={{
              disabled: isSearching,
            }}
            className="bg-teal-600 hover:bg-teal-700"
            title="search"
          />
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Search Results:</h2>

          {searchResults.length > 0 ? (
            <div className="bg-white rounded-lg border">
              <DataTable
                data={searchResults}
                columns={columns}
                enablePagination={false}
                isLoading={false}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-4">
                    A customer is Not Found with the Provided Search Criteria
                  </p>
                  <Button
                    onClick={handleCreateNew}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    CREATE NEW CUSTOMER
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerCreatePage;
