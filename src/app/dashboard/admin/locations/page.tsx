"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Edit,
  Trash2,
  Settings2,
  ChevronsUpDownIcon as ChevronUpDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Category, initiallocations, locations, SortDirection } from "./types";
import { AppSidebar } from "@/components/dashboard/admin/AdminSidebar";
import { NavActions } from "@/components/dashboard/admin/AdminNavAction";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function locationsPage() {
  const [locations, setlocations] =
    React.useState<Category[]>(initiallocations);
  const [filterValue, setFilterValue] = React.useState("");
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState<Omit<Category, "id">>({
    name: "",
    description: "",
    location: "",
    isHidden: false,
  });
  const [columnsVisible, setColumnsVisible] = React.useState({
    id: true,
    name: true,
    description: true,
    location: true,
  });
  const [sortColumn, setSortColumn] = React.useState<keyof Category | null>(
    null
  );
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const filteredlocations = React.useMemo(() => {
    let result = locations.filter(
      (category) =>
        category.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        category.description
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        category.location.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [locations, filterValue, sortColumn, sortDirection]);

  const handleSort = (column: keyof Category) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddCategory = () => {
    const id = `CAT-${String(locations.length + 1).padStart(3, "0")}`;
    setlocations([...locations, { id, ...newCategory }]);
    setNewCategory({
      name: "",
      description: "",
      location: "",
      isHidden: false,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (editingCategory) {
      setlocations(
        locations.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = () => {
    if (editingCategory) {
      setlocations(locations.filter((cat) => cat.id !== editingCategory.id));
      setIsDeleteDialogOpen(false);
      setEditingCategory(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>JirehDashboard</p>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Locations</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Select
                        value={newCategory.location}
                        onValueChange={(value) =>
                          setNewCategory({ ...newCategory, location: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isHidden" className="text-right">
                        Hidden
                      </Label>
                      <Checkbox
                        id="isHidden"
                        checked={newCategory.isHidden}
                        onCheckedChange={(checked) =>
                          setNewCategory({
                            ...newCategory,
                            isHidden: checked as boolean,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filter and Settings */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter locations..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={columnsVisible.id}
                    onCheckedChange={(checked) =>
                      setColumnsVisible((prev) => ({ ...prev, id: checked }))
                    }
                  >
                    ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnsVisible.name}
                    onCheckedChange={(checked) =>
                      setColumnsVisible((prev) => ({ ...prev, name: checked }))
                    }
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnsVisible.description}
                    onCheckedChange={(checked) =>
                      setColumnsVisible((prev) => ({
                        ...prev,
                        description: checked,
                      }))
                    }
                  >
                    Description
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnsVisible.location}
                    onCheckedChange={(checked) =>
                      setColumnsVisible((prev) => ({
                        ...prev,
                        location: checked,
                      }))
                    }
                  >
                    Location
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columnsVisible.id && (
                        <TableHead className="w-[100px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center">
                              ID
                              <ChevronUpDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleSort("id")}
                              >
                                Sort Ascending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSort("id")}
                              >
                                Sort Descending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnsVisible.name && (
                        <TableHead>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center">
                              Name
                              <ChevronUpDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleSort("name")}
                              >
                                Sort Ascending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSort("name")}
                              >
                                Sort Descending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnsVisible.description && (
                        <TableHead>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center">
                              Description
                              <ChevronUpDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleSort("description")}
                              >
                                Sort Ascending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSort("description")}
                              >
                                Sort Descending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnsVisible.location && (
                        <TableHead>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center">
                              Location
                              <ChevronUpDown className="ml-2 h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleSort("location")}
                              >
                                Sort Ascending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSort("location")}
                              >
                                Sort Descending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredlocations.map((category) => (
                      <TableRow
                        key={category.id}
                        className={category.isHidden ? "opacity-50" : ""}
                      >
                        {columnsVisible.id && (
                          <TableCell>{category.id}</TableCell>
                        )}
                        {columnsVisible.name && (
                          <TableCell>{category.name}</TableCell>
                        )}
                        {columnsVisible.description && (
                          <TableCell>{category.description}</TableCell>
                        )}
                        {columnsVisible.location && (
                          <TableCell>{category.location}</TableCell>
                        )}
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog
                              open={isEditDialogOpen}
                              onOpenChange={setIsEditDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                  <DialogDescription>
                                    Make changes to the category details.
                                  </DialogDescription>
                                </DialogHeader>
                                {editingCategory && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="edit-name"
                                        className="text-right"
                                      >
                                        Name
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        value={editingCategory.name}
                                        onChange={(e) =>
                                          setEditingCategory({
                                            ...editingCategory,
                                            name: e.target.value,
                                          })
                                        }
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="edit-description"
                                        className="text-right"
                                      >
                                        Description
                                      </Label>
                                      <Input
                                        id="edit-description"
                                        value={editingCategory.description}
                                        onChange={(e) =>
                                          setEditingCategory({
                                            ...editingCategory,
                                            description: e.target.value,
                                          })
                                        }
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="edit-location"
                                        className="text-right"
                                      >
                                        Location
                                      </Label>
                                      <Select
                                        value={editingCategory.location}
                                        onValueChange={(value) =>
                                          setEditingCategory({
                                            ...editingCategory,
                                            location: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="col-span-3">
                                          <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {locations.map((location) => (
                                            <SelectItem
                                              key={location}
                                              value={location}
                                            >
                                              {location}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="edit-isHidden"
                                        className="text-right"
                                      >
                                        Hidden
                                      </Label>
                                      <Checkbox
                                        id="edit-isHidden"
                                        checked={editingCategory.isHidden}
                                        onCheckedChange={(checked) =>
                                          setEditingCategory({
                                            ...editingCategory,
                                            isHidden: checked as boolean,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    onClick={handleEditCategory}
                                  >
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog
                              open={isDeleteDialogOpen}
                              onOpenChange={setIsDeleteDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Category</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this
                                    category? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleDeleteCategory}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredlocations.length} row(s) found
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page 1 of 1
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronFirst className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLast className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}