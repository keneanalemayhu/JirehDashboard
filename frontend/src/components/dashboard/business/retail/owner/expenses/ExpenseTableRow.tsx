"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Expense {
  id: number;
  name: string;
  amount: number;
  location: string;
  expenseDate: string;
  frequency:
    | "One-time"
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Yearly";
}

interface ExpenseTableRowProps {
  expense: Expense;
  columnsVisible: {
    id: boolean;
    name: boolean;
    amount: boolean;
    location: boolean;
    frequency: boolean;
    expenseDate: boolean;
  };
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTableRow({
  expense,
  columnsVisible,
  onEdit,
  onDelete,
}: ExpenseTableRowProps) {
  // Format amount as currency
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(expense.amount);

  // Format date
  const formattedDate = new Date(expense.expenseDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <TableRow>
      {/* ID Column */}
      {columnsVisible.id && <TableCell>{expense.id}</TableCell>}

      {/* Name Column */}
      {columnsVisible.name && <TableCell>{expense.name}</TableCell>}

      {/* Amount Column */}
      {columnsVisible.amount && (
        <TableCell className="text-right">{formattedAmount}</TableCell>
      )}

      {/* Location Column */}
      {columnsVisible.location && <TableCell>{expense.location}</TableCell>}

      {/* Frequency Column */}
      {columnsVisible.frequency && (
        <TableCell>
          <span className={getFrequencyColor(expense.frequency)}>
            {expense.frequency}
          </span>
        </TableCell>
      )}

      {/* Date Column */}
      {columnsVisible.expenseDate && <TableCell>{formattedDate}</TableCell>}

      {/* Actions Column */}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {expense.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(expense)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {expense.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Helper function to get color classes based on frequency
function getFrequencyColor(frequency: Expense["frequency"]): string {
  switch (frequency) {
    case "Daily":
      return "text-blue-500 font-medium";
    case "Weekly":
      return "text-green-500 font-medium";
    case "Monthly":
      return "text-purple-500 font-medium";
    case "Quarterly":
      return "text-yellow-500 font-medium"; // Using yellow for better contrast
    case "Yearly":
      return "text-red-500 font-medium";
    default:
      return "text-gray-500"; // For "One-time"
  }
}
