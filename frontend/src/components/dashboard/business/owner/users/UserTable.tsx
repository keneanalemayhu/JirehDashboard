"use client";

import { Table, TableBody } from "@/components/ui/table";
import { User } from "@/types/dashboard/business/user";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserTableProps {
  users: User[];
  columnsVisible: {
    id: boolean;
    username: boolean;
    name: boolean;
    email: boolean;
    phone: boolean;
    location: boolean;
    role: boolean;
  };
  onSort: (column: keyof User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isLoading = false,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No users found
      </div>
    );
  }
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <UserTableHeader columnsVisible={columnsVisible} onSort={onSort} />
          <TableBody>
            {users.map((user, index) => (
              <UserTableRow
                key={user.id ?? `user-${index}`} // Fallback to index if id is missing
                user={user}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
