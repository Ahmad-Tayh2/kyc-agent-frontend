import * as React from "react";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { paginationsPagesOptions } from "@/constants/options";

// interface PaginationObject {
//   per_page: number;
//   page: number;
//   total
// }
interface DataTableProps {
  data: any[];
  columns: any[];
  pagination?: {
    enable: boolean;
    page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    last_page: number;
    onChangeRowsPerPage: (value: number) => void;
    setPage: (p: number) => void;
  };
  onUpdatePagination?: (obj: any) => void;
  tableTitle?: string;
  isLoading?: boolean;
  error?: any;
}

export function DataTable({
  data = [],
  columns,
  tableTitle,
  pagination,
  isLoading = false,
  error,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Pagination control
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);

  const paginatedData = React.useMemo(() => {
    if (!pagination?.per_page) return data;
    if (!data || data.length === 0) return [];
    return data.slice(
      (currentPage - 1) * pagination?.per_page,
      currentPage * pagination?.per_page
    );
  }, [data, currentPage, pagination?.per_page]);

  // Handlers for pagination

  const table = useReactTable({
    data: paginatedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full rounded-md bg-white overflow-hidden">
        {tableTitle && (
          <h1 className="p-5 text-2xl font-semibold">{tableTitle}</h1>
        )}
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full rounded-md bg-white overflow-hidden">
        {tableTitle && (
          <h1 className="p-5 text-2xl font-semibold">{tableTitle}</h1>
        )}
        <div className="flex items-center justify-center h-32 text-red-500">
          <span>Error loading data. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full rounded-md bg-white overflow-hidden">
        {tableTitle && (
          <h1 className="p-5 text-2xl font-semibold">{tableTitle}</h1>
        )}
        <div className=" bg-white border-b border-b-1 border-[#E4E7EC]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b-1 border-primary bg-primary/10 hover:bg-primary/10"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-transparent">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-primary/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    {data && data.length === 0
                      ? "No data available."
                      : "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* pagination */}
        {pagination?.enable && (
          <Pagination className="py-2 px-5">
            <PaginationContent className="w-full flex justify-between items-center">
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => pagination.setPage(pagination.page - 1)}
                  className="cursor-pointer hover:bg-primary/10"
                >
                  <ArrowLeft /> <span>Previous</span>
                </Button>
              </PaginationItem>

              {/* Page Numbers */}
              <div className="flex justify-between items-center gap-1">
                {Array.from({ length: pagination?.total }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      className="hover:primary/10"
                      onClick={() => pagination.setPage(index + 1)}
                      isActive={pagination?.page === index + 1}
                      href="#"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </div>

              {/* Optional Ellipsis for large page numbers */}
              {pagination?.total > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next Button */}
              <PaginationItem className="flex items-center gap-2">
                {pagination.onChangeRowsPerPage && (
                  <SingleSelectDropdown
                    options={paginationsPagesOptions}
                    onValueChange={pagination.onChangeRowsPerPage}
                    selectedValue={String(pagination?.per_page)}
                    className="w-[120px]"
                  />
                )}
                <Button
                  variant="outline"
                  disabled={pagination?.page === pagination?.total}
                  onClick={() => pagination.setPage(pagination.page + 1)}
                  className="cursor-pointer hover:bg-primary/10"
                >
                  <span>Next</span>
                  <ArrowRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
