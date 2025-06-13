// src/components/floor-plan/AssignWaiterDropdown.tsx
"use client"

// This component's functionality has been integrated directly into TableCard.tsx
// using DropdownMenuSub components for a more streamlined UX.
// This file can be removed or kept for future reference if a standalone component is preferred later.

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { Waiter } from "@/lib/types"

// interface AssignWaiterDropdownProps {
//   waiters: Waiter[]
//   assignedWaiterId?: string | null
//   onAssign: (waiterId: string | null) => void
//   disabled?: boolean
// }

// export function AssignWaiterDropdown({ waiters, assignedWaiterId, onAssign, disabled }: AssignWaiterDropdownProps) {
//   return (
//     <Select
//       value={assignedWaiterId || "unassigned"}
//       onValueChange={(value) => onAssign(value === "unassigned" ? null : value)}
//       disabled={disabled || waiters.length === 0}
//     >
//       <SelectTrigger className="text-xs h-8">
//         <SelectValue placeholder="Assign Waiter" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="unassigned" className="italic text-muted-foreground">Unassign</SelectItem>
//         {waiters.map((waiter) => (
//           <SelectItem key={waiter.id} value={waiter.id}>
//             {waiter.name}
//           </SelectItem>
//         ))}
//         {waiters.length === 0 && <p className="p-2 text-xs text-muted-foreground">No waiters available.</p>}
//       </SelectContent>
//     </Select>
//   )
// }
export {}; // Empty export to satisfy TypeScript if file is kept
