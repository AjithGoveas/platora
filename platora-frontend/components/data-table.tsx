'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Column<T> = {
    header: string;
    accessorKey: keyof T;
    cell?: (row: T) => React.ReactNode;
    actions?: (row: T) => React.ReactNode;
};

type Props<T> = {
    data: T[];
    columns: Column<T>[];
};

export function DataTable<T>({ data, columns }: Props<T>) {
    return (
        <div className="border rounded-md overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, idx) => (
                            <TableHead key={idx} className="border-r whitespace-nowrap">
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {columns.map((col, colIdx) => (
                                <TableCell key={colIdx} className="border-r align-top">
                                    {col.cell
                                        ? col.cell(row)
                                        : col.actions
                                            ? col.actions(row)
                                            : String(row[col.accessorKey])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
