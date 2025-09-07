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
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loader from "@/components/shared/Loader";
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
import { cn } from "@/lib/utils";

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
  tableTitle?: string;
  isLoading?: boolean;
  error?: any;
  className?: string;
}

export function DataTable({
  data = [],
  columns,
  tableTitle,
  pagination,
  isLoading = false,
  className,
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

  const pagesLength = React.useMemo(() => {
    if (pagination?.last_page && pagination?.last_page > 0)
      return pagination?.last_page;
    return 0;
  }, [pagination?.last_page]);

  const pagesNumberToShow = React.useMemo(() => {
    let display: (number | string)[] = [];
    if (pagination?.last_page && pagesLength) {
      if (pagesLength < 7) {
        // Show all pages
        display = Array.from({ length: pagesLength }, (_, i) => i + 1);
      } else {
        // pagesLength >= 7 : defining the start and the end of the middle pages range
        const windowStart = Math.max(pagination?.page - 1, 2);
        const windowEnd = Math.min(pagination?.page + 1, pagesLength - 1);
        display.push(1);

        // first gap
        if (windowStart > 2) display.push("...");

        // middle window
        for (let p = windowStart; p <= windowEnd; p++) {
          display.push(p);
        }

        // second gap
        if (windowEnd < pagesLength - 1) display.push("...");

        // last page
        display.push(pagesLength);
      }
    }
    return display;
  }, [pagesLength, pagination?.page]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full rounded-md bg-white overflow-hidden">
        {tableTitle && (
          <h1 className="p-5 text-2xl font-semibold">{tableTitle}</h1>
        )}
        <div className="flex items-center justify-center h-32">
          <Loader size="50px" className="h-8 w-8 animate-spin" />
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
      <div
        className={cn("w-full rounded-md bg-white overflow-hidden", className)}
      >
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
                            )}{" "}
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
                {pagesNumberToShow?.map((page: string | number, index) => {
                  if (page === "...") {
                    return (
                      <PaginationItem key={index + 1}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else {
                    let isActive = pagination?.page === page;
                    return (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          className={cn(
                            "border-none cursor-pointer",
                            isActive && "bg-primary/20"
                          )}
                          onClick={() => pagination.setPage(Number(page))}
                          isActive={isActive}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                })}
              </div>

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
                  disabled={pagination?.page === pagesLength}
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
