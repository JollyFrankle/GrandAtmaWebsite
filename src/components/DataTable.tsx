"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/cn/components/ui/button"
import { Checkbox } from "@/cn/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/cn/components/ui/dropdown-menu"
import { Input } from "@/cn/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/cn/components/ui/table"

interface ColumnRules<T> {
    id?: string
    field: keyof T
    header: string
    cell?: (row: T) => React.ReactNode
    enableSorting?: boolean
    enableHiding?: boolean
}

interface RowActions<T> {
    action: string | React.ReactNode
    onClick: (row: T) => void
}

function generateActionChildren<T>(actions: RowActions<T>[], row: T) {
    return actions.map((action, i) => (
        <DropdownMenuItem onClick={() => action.onClick(row)} key={i}>{action.action}</DropdownMenuItem>
    ))
}

function generateColumns<T>(columns: ColumnRules<T>[], actions: RowActions<T>[][] = [], select: boolean = false): ColumnDef<T>[] {
    const headers: ColumnDef<T>[] = []

    if (select) {
        headers.push({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        })
    }

    for (const column of columns) {
        headers.push({
            accessorKey: column.id ?? column.field,
            header: ({ column: col }) => {
                return column.enableSorting ? (
                    <Button
                        variant="ghost"
                        onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
                        className="-mx-4"
                    >
                        {column.header}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <div className="capitalize">{column.header}</div>
                )
            },
            cell: ({ row }) => column.cell ? column.cell(row.original) : <div>{row.getValue(column.field.toString())}</div>,
            enableSorting: column.enableSorting ?? false,
            enableHiding: column.enableHiding ?? true,
        })
    }

    if (actions.length > 0) {
        headers.push({
            id: "__actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Tindakan</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel key={-1}>Tindakan</DropdownMenuLabel>
                            {actions.map((action, i) => (
                                <div key={i}>
                                    {generateActionChildren<T>(action, row.original)}
                                    {i < actions.length - 1 && <DropdownMenuSeparator />}
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        })
    }

    return headers
}


export default function DataTable<T>({
    data,
    columns,
    actions,
    select
}: {
    data: T[]
    columns: ColumnRules<T>[],
    actions?: RowActions<T>[][],
    select?: boolean
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns: generateColumns<T>(columns, actions, select),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Tampilkan <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {columns
                            .filter((col) => col.enableHiding ?? true)
                            .map((col, i) => {
                                const column = table.getColumn(col.id ?? col.field.toString())
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={i}
                                        checked={column?.getIsVisible() ?? true}
                                        onCheckedChange={(value) => column?.toggleVisibility(!!value)}
                                    >
                                        {col.header}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {select ? (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} barus dipilih.
                    </div>
                ) : (
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} baris ditampilkan.
                    </div>
                )}
                    <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    </div >
  )
}
