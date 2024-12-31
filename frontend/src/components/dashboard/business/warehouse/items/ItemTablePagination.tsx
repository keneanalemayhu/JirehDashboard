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
  Clock,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItemTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  itemType?: "regular" | "temporary";
  totalRegularItems?: number;
  totalTemporaryItems?: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function ItemTablePagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  itemType,
  totalRegularItems = 0,
  totalTemporaryItems = 0,
}: ItemTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Ensure current page is valid when total items changes
  if (currentPage > totalPages) {
    onPageChange(totalPages);
  }

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10) as PageSize;
    onPageSizeChange(newSize);
    // Calculate new current page to maintain approximate scroll position
    const currentItem = (currentPage - 1) * pageSize + 1;
    const newPage = Math.max(1, Math.ceil(currentItem / newSize));
    onPageChange(newPage);
  };

  return (
    <div className="flex flex-col gap-2 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            Showing {startItem} to {endItem} of {totalItems}{" "}
            {itemType ? (
              <span className="inline-flex items-center gap-1">
                {itemType === "temporary" ? (
                  <>
                    <Clock className="h-4 w-4" />
                    temporary
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    regular
                  </>
                )}
              </span>
            ) : (
              ""
            )}{" "}
            results
          </span>
          {(totalRegularItems > 0 || totalTemporaryItems > 0) && (
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                <Archive className="h-3 w-3 mr-1" />
                Regular: {totalRegularItems}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Clock className="h-3 w-3 mr-1" />
                Temporary: {totalTemporaryItems}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-xs sm:hidden">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
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
