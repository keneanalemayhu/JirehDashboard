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
import { PaymentStatus, PaymentStatuses } from "@/types/dashboard/business/order";

interface OrderTableSettingsProps {
  showCurrency: boolean;
  onShowCurrencyChange: (show: boolean) => void;
  statusFilter: PaymentStatus[];
  onStatusFilterChange: (status: PaymentStatus) => void;
}

export function OrderTableSettings({
  showCurrency,
  onShowCurrencyChange,
  statusFilter,
  onStatusFilterChange,
}: OrderTableSettingsProps) {
  const paymentStatuses: PaymentStatus[] = [
    PaymentStatuses.PAID,
    PaymentStatuses.PENDING,
    PaymentStatuses.CANCELLED
  ];

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
          checked={showCurrency}
          onCheckedChange={onShowCurrencyChange}
        >
          Show Currency Symbol
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        {paymentStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter.includes(status)}
            onCheckedChange={() => onStatusFilterChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
