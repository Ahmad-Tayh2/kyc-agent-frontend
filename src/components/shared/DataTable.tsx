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
  // getPaginationRowModel,
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
import {
  frontEndPaginationsPagesOptions,
  paginationsPagesOptions,
} from "@/constants/options";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { getPagesLength, getPagesNumberToShow } from "@/helpers/pagination";

// interface PaginationObject {
//   per_page: number;
//   page: number;
//   total
// }

type FrontEndPaginationState = {
  enable: boolean;
  page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  last_page: number;
};

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
  tableHeaderComponent?: React.ReactElement;
  isLoading?: boolean;
  error?: any;
  className?: string;
  enableFrontEndPagination?: boolean;
}

export function DataTable({
  data = [],
  columns,
  tableTitle,
  tableHeaderComponent,
  pagination,
  isLoading = false,
  className,
  error,
  enableFrontEndPagination = false,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Frontend pagination

  const [frontEndPaginationStates, setFrontEndPaginationStates] =
    useState<FrontEndPaginationState>({
      enable: false,
      page: 1,
      per_page: Number(frontEndPaginationsPagesOptions[0]?.value),
      total: 0,
      from: 0,
      to: 0,
      last_page: 1,
    });

  useEffect(() => {
    setFrontEndPaginationStates((prev) => ({
      ...prev,
      enable: enableFrontEndPagination,
    }));
  }, [enableFrontEndPagination]);
  const frontEndPaginatedData = useMemo(() => {
    if (!frontEndPaginationStates.enable) return [];

    const start =
      (frontEndPaginationStates.page - 1) * frontEndPaginationStates.per_page;
    const end = start + frontEndPaginationStates.per_page;
    const sliced = data.slice(start, end);

    setFrontEndPaginationStates((prev) => ({
      ...prev,
      total: data.length,
      from: start + 1,
      to: Math.min(end, data.length),
      last_page: Math.ceil(data.length / prev.per_page),
    }));

    return sliced;
  }, [
    data,
    frontEndPaginationStates.page,
    frontEndPaginationStates.per_page,
    frontEndPaginationStates.enable,
  ]);
  const handlePageChange = (page: number) => {
    setFrontEndPaginationStates((prev) => ({
      ...prev,
      page: page < 1 ? 1 : page > prev.last_page ? prev.last_page : page,
    }));
  };
  const handleChangeRowsPerPage = (rows: number) => {
    setFrontEndPaginationStates((prev) => ({
      ...prev,
      per_page: rows,
    }));
  };
  const frontEndPagesLength = useMemo(
    () => getPagesLength(frontEndPaginationStates?.last_page),
    [frontEndPaginationStates?.last_page]
  );

  const frontEndPagesNumberToShow = useMemo(
    () =>
      getPagesNumberToShow(
        frontEndPaginationStates?.page ?? 1,
        frontEndPaginationStates?.last_page ?? 0
      ),
    [frontEndPaginationStates?.page, frontEndPaginationStates?.last_page]
  );
  // end of Frontend pagination

  // Backend pagination control
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

  const pagesLength = useMemo(
    () => getPagesLength(pagination?.last_page),
    [pagination?.last_page]
  );

  const pagesNumberToShow = useMemo(
    () =>
      getPagesNumberToShow(pagination?.page ?? 1, pagination?.last_page ?? 0),
    [pagination?.page, pagination?.last_page]
  );
  // end of Backend pagination

  // Handlers for pagination

  const table = useReactTable({
    data: frontEndPaginationStates.enable
      ? frontEndPaginatedData
      : paginatedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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
  const TableHeadComponent = () => {
    return (
      <div>
        {tableTitle && (
          <h1 className="p-5 text-2xl font-semibold">{tableTitle}</h1>
        )}
        {tableHeaderComponent && <div>{tableHeaderComponent}</div>}
      </div>
    );
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full rounded-md bg-white overflow-hidden">
        {(tableTitle || tableHeaderComponent) && <TableHeadComponent />}
        <div className="flex items-center justify-center h-45">
          <Loader size="50px" className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full rounded-md bg-white overflow-hidden">
        {(tableTitle || tableHeaderComponent) && <TableHeadComponent />}

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
        {(tableTitle || tableHeaderComponent) && <TableHeadComponent />}

        <div className=" bg-white border-b border-b-1 border-[#E4E7EC]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups()?.map((headerGroup) => (
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
                    className="hover:bg-primary/5 odd:bg-primary/4"
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
        {enableFrontEndPagination ? (
          <Pagination className="py-2 px-5">
            <PaginationContent className="w-full flex justify-between items-center">
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(frontEndPaginationStates.page - 1)
                  }
                  disabled={frontEndPaginationStates.page === 1}
                  className="cursor-pointer hover:bg-primary/10"
                >
                  <ArrowLeft /> <span>Previous</span>
                </Button>
              </PaginationItem>
              <div className="flex justify-between items-center gap-1">
                {frontEndPagesNumberToShow?.map(
                  (page: string | number, index) => {
                    if (page === "...") {
                      return (
                        <PaginationItem key={index + 1}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    } else {
                      let isActive = frontEndPaginationStates?.page === page;
                      return (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            className={cn(
                              "border-none cursor-pointer",
                              isActive && "bg-primary/20"
                            )}
                            onClick={() => handlePageChange(Number(page))}
                            isActive={isActive}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  }
                )}
              </div>

              <PaginationItem className="flex items-center gap-2">
                {handleChangeRowsPerPage && (
                  <SingleSelectDropdown
                    options={frontEndPaginationsPagesOptions}
                    onValueChange={handleChangeRowsPerPage}
                    selectedValue={String(frontEndPaginationStates?.per_page)}
                    className="w-[120px]"
                  />
                )}
                {/* of {frontEndPaginationStates?.total} */}
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(frontEndPaginationStates.page + 1)
                  }
                  disabled={
                    frontEndPaginationStates?.page === frontEndPagesLength
                  }
                  className="cursor-pointer hover:bg-primary/10"
                >
                  <span>Next</span>
                  <ArrowRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : (
          // <div className="flex justify-between items-center mt-4">
          //   <button
          //     onClick={() =>
          //       handlePageChange(frontEndPaginationStates.page - 1)
          //     }
          //     disabled={frontEndPaginationStates.page === 1}
          //   >
          //     Previous
          //   </button>

          //   <span>
          //     Page {frontEndPaginationStates.page} of{" "}
          //     {frontEndPaginationStates.last_page}
          //   </span>

          //   <button
          //     onClick={() =>
          //       handlePageChange(frontEndPaginationStates.page + 1)
          //     }
          //     disabled={
          //       frontEndPaginationStates.page ===
          //       frontEndPaginationStates.last_page
          //     }
          //   >
          //     Next
          //   </button>
          // </div>
          pagination?.enable &&
          (data?.length >= 10 || pagination?.page > 1) && ( //if the page is > 1 you should allow the user the navigate may be the previous page (because in that page the data.length may be less than 10)
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
                  {/* of {pagination?.total} */}
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
          )
        )}
      </div>
    </div>
  );
}
