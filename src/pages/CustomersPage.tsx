import { useCallback, useState, useMemo } from "react";
import { parseISO, format } from "date-fns";
import { DataTable } from "@/components/DataTable";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCustomers } from "@/hooks/useCustomers";
import StatusLabel from "@/components/StatusLabel";

import SendMoneyIcon from "@/assets/icons/send-money.svg?react";
import ViewDetailsIcon from "@/assets/icons/view-details.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import DropdownMenuOptions from "@/components/DropdownMenu";
import ActionButton from "@/components/ActionButton";
import PageTitle from "@/components/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { FilterButton } from "@/components/FilterButton";

interface FilterState {
  searchName: string;
  customerNumber: string;
  status: string; // e.g., 'active', 'inactive', ''
  dateCreated: string; // ISO date string or date object
  country: string;
}
export type Customer = {
  id: string;
  reference_number: string;
  first_name: string;
  last_name: string;
  country: {
    name: string;
  };
  phone_number: string;
  created_at: string;
  status: string;
};

const statusColors: { [key: string]: string } = {
  active: "#027A48",
};

const menu: any[] = [
  {
    label: "Send Money",
    icon: <SendMoneyIcon />,
    onClick: () => {},
    // link: ROUTES.PROFILE,
  },
  {
    label: "View Details",
    icon: <ViewDetailsIcon />,
    onClick: () => {},
    // link: "#",
  },
  {
    label: "Edit Customer",
    icon: <EditIcon />,
    onClick: () => {},
    link: "",
  },
];
const useCustomerColumns = (): ColumnDef<Customer>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "reference_number",
        header: "Customer no.",
      },
      {
        accessorKey: "first_name",
        header: "First Name",
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => {
          const country: {
            name: string;
          } = row.getValue("country");

          return <div className="capitalize">{country?.name}</div>;
        },
      },
      {
        accessorKey: "phone_number",
        header: "Mobile Number",
      },
      {
        accessorKey: "created_at",
        header: "Reg. date",
        cell: ({ row }) => {
          const value: string = row.getValue("created_at");
          const date = parseISO(value);
          const formattedDate = format(date, "dd-MM-yyyy");
          return formattedDate;
        },
      },
      {
        accessorKey: "transactions",
        header: "Transactions",
      },
      {
        accessorKey: "recipients",
        header: "Recipients",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value: string = row.getValue("status");
          const color = statusColors[value] || "#000000";
          return <StatusLabel value={value} color={color} />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: (
          {
            /*row*/
          }
        ) => {
          // const customer = row.original;
          return (
            <DropdownMenuOptions
              menu={menu}
              trigger={
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              }
            />
          );
        },
      },
    ],
    []
  );
};

const CustomersPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = useCustomerColumns();
  const [filters, setFilters] = useState<FilterState>({
    searchName: "",
    customerNumber: "",
    status: "",
    dateCreated: "",
    country: "",
  });

  // Update functions for each filter
  const updateSearchName = useCallback((name: string) => {
    setFilters((prev) => ({ ...prev, searchName: name }));
  }, []);

  const updateCustomerNumber = useCallback((number: string) => {
    setFilters((prev) => ({ ...prev, customerNumber: number }));
  }, []);

  // const updateStatus = useCallback((status: string) => {
  //   setFilters((prev) => ({ ...prev, status }));
  // }, []);

  // const updateDateCreated = useCallback((date: string) => {
  //   setFilters((prev) => ({ ...prev, dateCreated: date }));
  // }, []);

  // const updateCountry = useCallback((country: string) => {
  //   setFilters((prev) => ({ ...prev, country }));
  // }, []);

  // Memoize filters to prevent unnecessary API calls
  const filtersString = useMemo(() => "", []);

  const { data: response, isLoading, error } = useGetCustomers(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.customers.title")} />
        <ActionButton title={"add new customer"} icon={<AddCustomerIcon />} />
      </div>
      <div className="flex items-center justify-between flex-wrap">
        <SearchInput
          placeholder={"Search by customer's name or phone"}
          value={filters.searchName}
          onChange={(value: string) => updateSearchName(value)}
        />
        <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
          <SearchInput
            placeholder={"Search by customer's number"}
            value={filters.customerNumber}
            onChange={(value: string) => updateCustomerNumber(value)}
          />
          <FilterButton onClick={() => {}} onResetClick={() => {}}>
            <div>status input</div>
            <div>date input</div>
            <div>country input</div>
          </FilterButton>
        </div>
      </div>
      <div>
        <DataTable
          data={customersData}
          columns={columns}
          enablePagination={true}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
