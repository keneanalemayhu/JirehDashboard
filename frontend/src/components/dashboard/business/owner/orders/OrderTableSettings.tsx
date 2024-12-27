import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { PaymentStatus } from "@/types/dashboard/business/order";

interface OrderTableSettingsProps {
  settings: {
    showAmounts: boolean;
    showEmployeeInfo: boolean;
    showCustomerInfo: boolean;
    statusFilter: PaymentStatus[];
    sortDirection: "asc" | "desc";
    itemsPerPage: number;
  };
  onSettingsChange: {
    onShowAmountsChange: (show: boolean) => void;
    onShowEmployeeInfoChange: (show: boolean) => void;
    onShowCustomerInfoChange: (show: boolean) => void;
    onStatusFilterChange: (status: PaymentStatus) => void;
    onSortDirectionChange: (direction: "asc" | "desc") => void;
    onItemsPerPageChange: (size: number) => void;
  };
}

const pageSizeOptions = [10, 20, 30, 50, 100];

export function OrderTableSettings({
  settings,
  onSettingsChange,
}: OrderTableSettingsProps) {
  const {
    showAmounts,
    showEmployeeInfo,
    showCustomerInfo,
    statusFilter,
    sortDirection,
    itemsPerPage,
  } = settings;

  const {
    onShowAmountsChange,
    onShowEmployeeInfoChange,
    onShowCustomerInfoChange,
    onStatusFilterChange,
    onSortDirectionChange,
    onItemsPerPageChange,
  } = onSettingsChange;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Table Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Display Options */}
        <DropdownMenuLabel className="text-xs">
          Display Options
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={showAmounts}
          onCheckedChange={onShowAmountsChange}
        >
          Show Amounts
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showEmployeeInfo}
          onCheckedChange={onShowEmployeeInfoChange}
        >
          Show Employee Info
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showCustomerInfo}
          onCheckedChange={onShowCustomerInfoChange}
        >
          Show Customer Info
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Payment Status Filter */}
        <DropdownMenuLabel className="text-xs">
          Payment Status
        </DropdownMenuLabel>
        {Object.values(PaymentStatus).map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter.includes(status)}
            onCheckedChange={() => onStatusFilterChange(status)}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        {/* Sort Direction */}
        <DropdownMenuLabel className="text-xs">
          Sort Direction
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={sortDirection === "asc"}
          onCheckedChange={() =>
            onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
          }
        >
          Ascending Order
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Items Per Page */}
        <DropdownMenuLabel className="text-xs">
          Items Per Page
        </DropdownMenuLabel>
        {pageSizeOptions.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => onItemsPerPageChange(size)}
            className={itemsPerPage === size ? "bg-accent" : ""}
          >
            {size} items
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
