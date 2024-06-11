import React from "react"
import { cn } from "@asyncapi/studio-utils"
interface ChipInputProps {
  chip: string
  onDelete: (chip: string) => void
}

export const Chip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & ChipInputProps>(
  ({ chip, onDelete,className , ...props }, ref) => {
    return (
      <div
        className={cn("m-1 w-fit bg-gray-100 text-gray-900 rounded px-2 py-1 flex items-center border border-gray-400 focus:border-blue-500 focus:border-2 focus:outline-none", className)}
        style={{ height: "28px", borderStyle: "solid" }}
        ref={ref}
        onClick={(e) => {
          console.log("Chip clicked")
        }}
        {...props}
      >
        <span>{chip}</span>
        <button
          onClick={(e) => {
            console.log("Delete button clicked")
            onDelete(chip)
          }}
          tabIndex={-1}
          className="ml-1 text-gray-400 focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    )
  }
)
