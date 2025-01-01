"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/dashboard/business/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "isActive", label: "Status" },
    { key: "isHidden", label: "Visibility" },
    { key: "createdAt", label: "Created" },
    { key: "updatedAt", label: "Updated" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.isHidden
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {category.isHidden ? "Hidden" : "Visible"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(category.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
