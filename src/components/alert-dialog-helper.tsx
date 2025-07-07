"use client"

import { ReactNode } from "react"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogHelperProps {
  className?: string
  title?: string
  description?: string
  trigger: ReactNode
  children?: ReactNode
  func: () => void
  open?: boolean
  setOpen?: (open: boolean) => void
  disabled?: boolean
  isLoading?: boolean
}

export function AlertDialogHelper({
  className,
  title,
  description,
  trigger,
  children,
  func,
  disabled,
  open,
  setOpen,
  isLoading = false,
}: AlertDialogHelperProps) {
  return (
    <div className={cn("relative", className)}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {title ? <span>{title}</span> : "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {description ??
                "This action cannot be undone. This will permanently perform the action. Please proceed with caution."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>{children}</div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={func}
              disabled={disabled}
              className={cn(disabled ? "flex items-center gap-2" : "")}
            >
              Continue{" "}
              {isLoading && <LoaderCircle size={15} className="animate-spin" />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
