import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/types/dashboard/business/user";

interface UserTableHeaderProps {
  columnsVisible: Record<keyof User, boolean>;
  onSort: (column: keyof User) => void;
}

type ColumnConfig = {
  key: keyof User;
  label: string;
  width?: string;
  sortable?: boolean;
};

const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "username", label: "Username", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "locationId", label: "Location", sortable: true },
  { key: "role", label: "Role", width: "w-[120px]", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: true },
];

export function UserTableHeader({
  columnsVisible,
  onSort,
}: UserTableHeaderProps) {
  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {column.label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Descending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map(
          (column) =>
            columnsVisible[column.key] && (
              <TableHead key={column.key} className={column.width}>
                {column.sortable ? renderSortableHeader(column) : column.label}
              </TableHead>
            )
        )}
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}