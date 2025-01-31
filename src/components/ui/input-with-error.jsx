'use client'

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Icon } from "@iconify/react"

export const InputWithError = forwardRef(({
  className,
  error,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <Input
        ref={ref}
        className={cn(
          error && "!outline !outline-2 outline-red-500 focus-visible:!ring-0 focus:!outline-red-500",
          className
        )}
        {...props}
      />
    </div>
  )
})