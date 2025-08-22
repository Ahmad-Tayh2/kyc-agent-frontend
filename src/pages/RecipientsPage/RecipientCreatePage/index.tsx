import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { useSearchRecipient } from "@/hooks/data/useRecipients";
import { recipientsColumns } from "@/components/recipients/RecipientsTableColumns";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";
import SearchNotFound from "@/components/shared/SearchNotFound";

interface SearchFormData {
  name: string;
  phone_number: string;
}

const RecipientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    name: "",
    phone_number: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { mutateAsync: searchRecipient, isPending: isSearching } =
    useSearchRecipient();
  const columns = recipientsColumns();

  const handleSearch = async () => {
    if (!searchForm.phone_number && !searchForm.name) {
      return;
    }

    try {
      const result = await searchRecipient({
        name: searchForm.name || undefined,
        phone_number: searchForm.phone_number || undefined,
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
      <div className="bg-white rounded-lg border ">
        <div className="p-6 border-b-1">
          You can add an existing recipient of other agents by searching them.
        </div>
        <div className="flex items-end gap-4 flex-wrap p-6">
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
                isLoading={false}
              />
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
