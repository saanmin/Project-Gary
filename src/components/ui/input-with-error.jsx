'use client'

import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Icon } from "@iconify/react"

export const InputWithError = ({
  className,
  error,
  ...props
}) => {
  return (
    <div className="relative">
      <Input
        className={cn(
          error && "!outline !outline-2 outline-red-500 focus-visible:!ring-0",
          className
        )}
        {...props}
      />
    </div>
  )
}