// src/components/floor-plan/TableCardsGrid.tsx
"use client";

import type { TableDefinition, Waiter } from "@/lib/types";
import { TableCard } from "@/components/floor-plan/TableCard"; // To be created

interface TableCardsGridProps {
  tables: TableDefinition[];
  waiters: Waiter[];
}

export function TableCardsGrid({ tables, waiters }: TableCardsGridProps) {
  if (!tables || tables.length === 0) {
    return <p className="text-muted-foreground">No tables to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} waiters={waiters} />
      ))}
    </div>
  );
}
