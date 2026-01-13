import { SearchInput } from "../shared/SearchInput";
import { QuestionItem } from "./QuestionItem";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import { paginationsPagesOptions } from "@/constants/options";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface QuestionType {
  title: string;
  description: string;
}
interface QuestionsTableProps {
  data?: QuestionType[];
}

export const QuestionsTable = (props: QuestionsTableProps) => {
  const { data } = props;
  return (
    <div className="bg-white rounded-md">
      <div className="border-b-1 border-gray-200 p-5 flex justify-between flex-wrap gap-3">
        <div className="text-2xl font-bold">Frequently Asked Questions</div>
        <SearchInput value="" onChange={() => {}} />
      </div>
      <div className="border-b-1 border-gray-200 p-5 flex flex-col gap-2">
        {data?.map((question: QuestionType, index: number) => (
          <QuestionItem
            key={index}
            title={question.title}
            description={question.description}
          />
        ))}
      </div>
      <div className="p-5">
        <QuestionsPagination />
      </div>
    </div>
  );
};

const QuestionsPagination = (props: any) => {
  const { pagination } = props;
  const pagesLength = useMemo(() => {
    if (pagination?.last_page && pagination?.last_page > 0)
      return pagination?.last_page;
    return 0;
  }, [pagination?.last_page]);

  const pagesNumberToShow = useMemo(() => {
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
        if (windowStart > 2) display.push("...");
        for (let p = windowStart; p <= windowEnd; p++) {
          display.push(p);
        }
        if (windowEnd < pagesLength - 1) display.push("...");
        display.push(pagesLength);
      }
    }
    return display;
  }, [pagesLength, pagination?.page]);
  return (
    <Pagination className="py-2 px-5">
      <PaginationContent className="w-full flex justify-between items-center">
        {/* Previous Button */}
        <PaginationItem>
          <Button
            variant="outline"
            disabled={pagination?.page === 1}
            onClick={() => pagination?.setPage(pagination?.page - 1)}
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
                    onClick={() => pagination?.setPage(Number(page))}
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
          {pagination?.onChangeRowsPerPage && (
            <SingleSelectDropdown
              options={paginationsPagesOptions}
              onValueChange={pagination?.onChangeRowsPerPage}
              selectedValue={String(pagination?.per_page)}
              className="w-[120px]"
            />
          )}
          <Button
            variant="outline"
            disabled={pagination?.page === pagesLength}
            onClick={() => pagination?.setPage(pagination?.page + 1)}
            className="cursor-pointer hover:bg-primary/10"
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
