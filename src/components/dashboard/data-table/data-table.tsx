"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import { animate, stagger } from "motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type FilterOption = {
  label: string;
  column: string;
  options: Array<{
    label: string;
    value: string | null;
  }>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions?: FilterOption[];
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterOptions = [],
  searchPlaceholder = "Pretraži",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<
    Record<string, string | null>
  >({});

  const tableRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  React.useEffect(() => {
    // Animate table appearance on mount
    if (tableRef.current) {
      animate(
        tableRef.current,
        {
          opacity: [0, 1],
          y: [20, 0],
        } as any,
        {
          duration: 0.4,
          easing: [0.25, 0.1, 0.25, 1], // cubic-bezier equivalent of 'ease-out'
        } as any,
      );
    }

    // Animate search input
    if (searchInputRef.current) {
      animate(
        searchInputRef.current,
        {
          scale: [0.95, 1],
          opacity: [0, 1],
        } as any,
        {
          duration: 0.3,
          delay: 0.2,
        } as any,
      );
    }
  }, []);

  // Animate table rows when data changes
  React.useEffect(() => {
    if (tableBodyRef.current) {
      const rows = tableBodyRef.current.querySelectorAll("tr");
      if (rows.length > 0) {
        animate(
          rows,
          {
            opacity: [0, 1],
            x: [-10, 0],
          } as any,
          {
            delay: stagger(0.05),
            duration: 0.3,
            easing: [0.25, 0.1, 0.25, 1], // cubic-bezier equivalent of 'ease-out'
          } as any,
        );
      }
    }
  }, [data, globalFilter, columnFilters]);

  const handleFilterChange = (column: string, value: string | null) => {
    const isCurrentlyActive = activeFilters[column] === value;

    if (isCurrentlyActive) {
      // Remove filter if it's already active
      const tableColumn = table.getColumn(column);
      if (tableColumn) {
        tableColumn.setFilterValue(undefined);
      }

      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[column];
        return newFilters;
      });
    } else {
      // Set new filter
      const tableColumn = table.getColumn(column);
      if (tableColumn) {
        tableColumn.setFilterValue(value);
      }

      setActiveFilters((prev) => ({
        ...prev,
        [column]: value,
      }));
    }
  };

  return (
    <div className="w-full" ref={tableRef}>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-md">
        <Table
          filterComponent={
            <div className="flex w-full items-center justify-between space-x-2">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ""}
                  onChange={(event) => {
                    setGlobalFilter(event.target.value);
                    // Animate filter dropdown buttons when search changes
                    const filterButtons =
                      document.querySelectorAll(".filter-button");
                    if (filterButtons.length > 0) {
                      animate(
                        filterButtons,
                        { scale: [0.97, 1] },
                        { duration: 0.2 },
                      );
                    }
                  }}
                  className="w-xs pr-10"
                />
                <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-black" />
              </div>
              <div className="flex items-center gap-2">
                {filterOptions.map((filter) => (
                  <DropdownMenu key={filter.column}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="filter-button flex items-center gap-2"
                        data-filter-label={filter.label}
                      >
                        {filter.label} <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      onCloseAutoFocus={() => {
                        // Animate dropdown close
                        const dropdownItems =
                          document.querySelectorAll(".dropdown-item");
                        if (dropdownItems.length > 0) {
                          animate(
                            dropdownItems,
                            { opacity: [1, 0], y: [0, -5] },
                            {
                              duration: 0.2,
                              delay: stagger(0.03, { from: "last" }),
                            },
                          );
                        }
                      }}
                    >
                      {filter.options.map((option) => (
                        <DropdownMenuCheckboxItem
                          className="dropdown-item"
                          key={option.label}
                          checked={
                            activeFilters[filter.column] === option.value
                          }
                          onCheckedChange={() => {
                            handleFilterChange(filter.column, option.value);
                            // Animate button on selection
                            const button = document.querySelector(
                              `button[data-filter-label="${filter.label}"]`,
                            );
                            if (button) {
                              animate(
                                button,
                                { scale: [1.05, 1] },
                                { duration: 0.2 },
                              );
                            }
                          }}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            </div>
          }
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={() => {
                      if (header.column.getCanSort()) {
                        // Animate header on sort
                        const headerElement = document.getElementById(
                          `header-${header.id}`,
                        );
                        if (headerElement) {
                          animate(
                            headerElement,
                            { scale: [1.05, 1] },
                            { duration: 0.2 },
                          );
                        }
                      }
                    }}
                    id={`header-${header.id}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    // Animate row on click
                    const rowElement = document.getElementById(`row-${row.id}`);
                    if (rowElement) {
                      animate(
                        rowElement,
                        {
                          backgroundColor: [
                            "rgba(0, 0, 0, 0.05)",
                            "transparent",
                          ],
                        },
                        { duration: 0.3 },
                      );
                    }
                  }}
                  id={`row-${row.id}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nema rezultata.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
