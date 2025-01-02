"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderTableSettingsProps {
  showAmounts: boolean;
  showEmployeeInfo: boolean;
  showCustomerInfo: boolean;
  onShowAmountsChange: (show: boolean) => void;
  onShowEmployeeInfoChange: (show: boolean) => void;
  onShowCustomerInfoChange: (show: boolean) => void;
}

export function OrderTableSettings({
  showAmounts,
  showEmployeeInfo,
  showCustomerInfo,
  onShowAmountsChange,
  onShowEmployeeInfoChange,
  onShowCustomerInfoChange,
}: OrderTableSettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Table settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Display Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
