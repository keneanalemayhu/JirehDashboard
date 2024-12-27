"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export interface ExpenseTablePaginationProps {
  totalExpenses: number;
  pageSize: PageSize;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
  expenseType?: "regular" | "recurring";
  totalRegularExpenses?: number;
  totalRecurringExpenses?: number;
  totalRegularAmount?: number;
  totalRecurringAmount?: number;
}

export function ExpenseTablePagination({
  totalExpenses,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  expenseType,
  totalRegularExpenses = 0,
  totalRecurringExpenses = 0,
  totalRegularAmount = 0,
  totalRecurringAmount = 0,
}: ExpenseTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalExpenses / pageSize));
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Calculate the range of expenses being displayed
  const startExpense = totalExpenses > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endExpense = Math.min(currentPage * pageSize, totalExpenses);

  // Ensure current page is valid when total expenses changes
  if (currentPage > totalPages) {
    onPageChange(totalPages);
  }

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10) as PageSize;
    if (!PAGE_SIZE_OPTIONS.includes(newSize)) return;

    onPageSizeChange(newSize);
    // Calculate new current page to maintain approximate scroll position
    const currentExpense = (currentPage - 1) * pageSize + 1;
    const newPage = Math.max(1, Math.ceil(currentExpense / newSize));
    onPageChange(newPage);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-2 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            Showing {startExpense} to {endExpense} of {totalExpenses}{" "}
            {expenseType ? (
              <span className="inline-flex items-center gap-1">
                {expenseType === "recurring" ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    recurring
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    regular
                  </>
                )}
              </span>
            ) : (
              ""
            )}{" "}
            expenses
          </span>
          {(totalRegularExpenses > 0 || totalRecurringExpenses > 0) && (
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                <FileText className="h-3 w-3 mr-1" />
                Regular: {totalRegularExpenses}
                <span className="ml-1 text-muted-foreground">
                  ({formatAmount(totalRegularAmount)})
                </span>
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <RefreshCw className="h-3 w-3 mr-1" />
                Recurring: {totalRecurringExpenses}
                <span className="ml-1 text-muted-foreground">
                  ({formatAmount(totalRecurringAmount)})
                </span>
              </Badge>
            </div>
          )}
        </div>
        <div className="text-xs sm:hidden">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Total Amount Display */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">
            Total: {formatAmount(totalRegularAmount + totalRecurringAmount)}
          </span>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
            className="hidden sm:flex"
            title="First Page"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Number Display */}
          <div className="hidden sm:flex min-w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
            className="hidden sm:flex"
            title="Last Page"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
