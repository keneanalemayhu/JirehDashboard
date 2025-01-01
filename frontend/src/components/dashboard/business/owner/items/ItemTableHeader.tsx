"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ItemTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">ID</TableHead>
        <TableHead className="w-[200px]">Name</TableHead>
        <TableHead className="w-[150px]">Barcode</TableHead>
        <TableHead className="w-[100px]">Price</TableHead>
        <TableHead className="w-[100px]">Quantity</TableHead>
        <TableHead className="w-[150px]">Category</TableHead>
        <TableHead className="w-[100px] text-center">Status</TableHead>
        <TableHead className="w-[100px] text-center">Visibility</TableHead>
        <TableHead className="w-[120px] text-center">Expiry Hours</TableHead>
        <TableHead className="w-[100px] text-center">Auto Reset</TableHead>
        <TableHead className="w-[130px] text-center">Time Status</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
