import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
    mobileHidden?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string | number;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    className?: string;
    // Optional renderer for the mobile card view. If not provided, it will list all non-hidden columns.
    renderMobileCard?: (row: T) => ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    emptyMessage = 'No data available',
    className,
    renderMobileCard,
}: DataTableProps<T>) {
    return (
        <div className={cn("w-full", className)}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-md border">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b bg-muted/50 transition-colors">
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    className={cn(
                                        "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                                        column.className
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {data.length > 0 ? (
                            data.map((row) => (
                                <tr
                                    key={keyExtractor(row)}
                                    onClick={() => onRowClick?.(row)}
                                    className={cn(
                                        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((column, colIdx) => (
                                        <td key={colIdx} className={cn("p-4 align-middle", column.className)}>
                                            {typeof column.accessor === 'function'
                                                ? column.accessor(row)
                                                : (row[column.accessor] as ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center align-middle text-muted-foreground">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((row) => (
                        <div
                            key={keyExtractor(row)}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                "rounded-xl border border-border/40 bg-card/40 p-4 transition-colors hover:bg-card/60",
                                onRowClick && "cursor-pointer"
                            )}
                        >
                            {renderMobileCard ? (
                                renderMobileCard(row)
                            ) : (
                                <div className="space-y-3">
                                    {columns.map((column, idx) => {
                                        if (column.mobileHidden) return null;
                                        const value = typeof column.accessor === 'function'
                                            ? column.accessor(row)
                                            : (row[column.accessor] as ReactNode);

                                        return (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                                    {column.header}
                                                </span>
                                                <div className="text-sm font-medium">
                                                    {value}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
