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

interface DataTableProps {
  data: any[];
  columns: any[];
  enablePagination?: boolean;
  rowsPerPage?: number;
  tableTitle?: string;
  isLoading?: boolean;
  error?: any;
}

export function DataTable({
  data = [],
  columns,
  enablePagination = true,
  rowsPerPage = 10,
  tableTitle,
  isLoading = false,
  error,
}: DataTableProps) {
  console.log(" data table renders");
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
  // const totalPages = Math.ceil(data.length / rowsPerPage);

  // // Slice data for current page
  // const paginatedData = data.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );
  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);

  // Slice data for current page
  const paginatedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [data, currentPage, rowsPerPage]);

  // Handlers for pagination
  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
        {enablePagination && totalPages > 0 && (
          <Pagination className="py-2 px-5">
            <PaginationContent className="w-full flex justify-between items-center">
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer hover:bg-primary/10"
                >
                  <ArrowLeft /> <span>Previous</span>
                </Button>
              </PaginationItem>

              {/* Page Numbers */}
              <div className="flex justify-between items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      href="#"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </div>

              {/* Optional Ellipsis for large page numbers */}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
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
