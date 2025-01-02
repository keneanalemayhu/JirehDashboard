"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { User, Role } from "@/types/dashboard/business/user";
import { cn } from "@/lib/utils";

interface UserTableRowProps {
  user: User;
  columnsVisible: {
    id: boolean;
    username: boolean;
    name: boolean;
    email: boolean;
    phone: boolean;
    location: boolean;
    role: boolean;
  };
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTableRow({
  user,
  columnsVisible,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800";
      case Role.EMPLOYEE:
        return "bg-blue-100 text-blue-800";
      case Role.SALES:
        return "bg-green-100 text-green-800";
      case Role.WAREHOUSE_MANAGER:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TableRow className={!user.isActive ? "opacity-50" : ""}>
      {columnsVisible.id && <TableCell>{user.id}</TableCell>}

      {columnsVisible.username && <TableCell>{user.username}</TableCell>}

      {columnsVisible.name && <TableCell>{user.name}</TableCell>}

      {columnsVisible.email && <TableCell>{user.email}</TableCell>}

      {columnsVisible.phone && <TableCell>{user.phone}</TableCell>}

      {columnsVisible.location && (
        <TableCell>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {user.location}
          </span>
        </TableCell>
      )}

      {columnsVisible.role && (
        <TableCell>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getRoleColor(user.role)
            )}
          >
            {user.role}
          </span>
        </TableCell>
      )}

      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {user.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(user)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {user.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
