"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Expense,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/expense";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface ExpenseTableRowProps {
  expense: Expense;
  columnsVisible: ColumnVisibility;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  recurringStatus?: string;
  getLocationName: (id: number) => string;
}

export function ExpenseTableRow({
  expense,
  columnsVisible,
  onEdit,
  onDelete,
  recurringStatus,
  getLocationName,
}: ExpenseTableRowProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getApprovalStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary", icon: Clock, text: "Pending" },
      approved: { variant: "default", icon: CheckCircle, text: "Approved" },
      rejected: { variant: "destructive", icon: XCircle, text: "Rejected" },
    } as const;

    const statusConfig = config[status as keyof typeof config];

    return (
      <Badge
        variant={statusConfig.variant}
        className="flex items-center gap-1 w-24 justify-center"
      >
        <statusConfig.icon className="w-3 h-3" />
        <span>{statusConfig.text}</span>
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge variant="outline" className="w-24 justify-center">
        {method}
      </Badge>
    );
  };

  const getRecurringBadge = (frequency: string) => {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <RefreshCw className="w-3 h-3" />
        <span>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}</span>
      </Badge>
    );
  };

  const getRecurringStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const config = {
      Ended: { variant: "destructive", icon: AlertCircle },
      Ongoing: { variant: "default", icon: RefreshCw },
    } as const;

    const isRemaining = status.includes("remaining");
    const variant = isRemaining
      ? "secondary"
      : config[status as keyof typeof config]?.variant || "default";
    const Icon = config[status as keyof typeof config]?.icon || Clock;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  if (!expense) return null;

  return (
    <TableRow>
      {columnsVisible.id && (
        <TableCell className="font-mono text-sm">
          {expense.id.toString().padStart(3, "0")}
        </TableCell>
      )}

      {columnsVisible.locationId && (
        <TableCell>{getLocationName(expense.locationId)}</TableCell>
      )}

      {columnsVisible.name && (
        <TableCell className="max-w-[200px] truncate">
          <Tooltip>
            <TooltipTrigger>
              <span>{expense.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{expense.name}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
      )}

      {columnsVisible.amount && (
        <TableCell className="font-medium">
          {formatAmount(expense.amount)}
        </TableCell>
      )}

      {columnsVisible.description && (
        <TableCell className="max-w-[200px] truncate">
          <Tooltip>
            <TooltipTrigger>
              <span>{expense.description}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{expense.description}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
      )}

      {columnsVisible.expenseDate && (
        <TableCell>
          {format(new Date(expense.expenseDate), "MMM d, yyyy")}
        </TableCell>
      )}

      {columnsVisible.paymentMethod && (
        <TableCell className="text-center">
          {getPaymentMethodBadge(expense.paymentMethod || "—")}
        </TableCell>
      )}

      {columnsVisible.receiptNumber && (
        <TableCell className="font-mono text-sm">
          {expense.receiptNumber || "—"}
        </TableCell>
      )}

      {columnsVisible.approvalStatus && (
        <TableCell className="text-center">
          {getApprovalStatusBadge(expense.approvalStatus)}
        </TableCell>
      )}

      {/* Recurring Expense specific columns */}
      {columnsVisible.recurringFrequency && expense.isRecurring && (
        <TableCell className="text-center">
          {getRecurringBadge(expense.recurringFrequency || "monthly")}
        </TableCell>
      )}

      {columnsVisible.recurringEndDate && expense.isRecurring && (
        <TableCell>
          {expense.recurringEndDate
            ? format(new Date(expense.recurringEndDate), "MMM d, yyyy")
            : "—"}
        </TableCell>
      )}

      {columnsVisible.recurringStatus && expense.isRecurring && (
        <TableCell className="text-center">
          {getRecurringStatusBadge(recurringStatus)}
        </TableCell>
      )}

      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(expense)}
            className="hover:text-primary"
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit expense</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            onClick={() => onDelete(expense)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete expense</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
