// src/components/floor-plan/TableStatusDropdown.tsx
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
// import type { TableStatus } from "@/lib/types"
// import { CheckCircle, Users, Clock, Utensils, LucideIcon } from "lucide-react"

// interface TableStatusDropdownProps {
//   currentStatus: TableStatus
//   onStatusChange: (newStatus: TableStatus) => void
//   disabled?: boolean
// }

// const statusOptions: { value: TableStatus; label: string; icon: LucideIcon }[] = [
//   { value: "vacant", label: "Vacant", icon: CheckCircle },
//   { value: "occupied", label: "Occupied", icon: Users },
//   { value: "needs_bill", label: "Needs Bill", icon: Clock },
//   { value: "needs_cleaning", label: "Needs Cleaning", icon: Utensils },
// ];

// export function TableStatusDropdown({ currentStatus, onStatusChange, disabled }: TableStatusDropdownProps) {
//   return (
//     <Select
//       value={currentStatus}
//       onValueChange={(value) => onStatusChange(value as TableStatus)}
//       disabled={disabled}
//     >
//       <SelectTrigger className="text-xs h-8">
//         <SelectValue placeholder="Change Status" />
//       </SelectTrigger>
//       <SelectContent>
//         {statusOptions.map((option) => (
//           <SelectItem key={option.value} value={option.value}>
//             <div className="flex items-center">
//               <option.icon className="mr-2 h-4 w-4" />
//               {option.label}
//             </div>
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// }
export {}; // Empty export to satisfy TypeScript if file is kept
