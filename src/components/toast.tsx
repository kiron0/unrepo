"use client"

import { toast } from "@/hooks/use-toast"

interface ToastProps {
  title?: string
  description: string
}

export const notifySuccess = ({ description, title }: ToastProps) => {
  toast({
    title: title || "Success",
    description,
    variant: "default",
  })
}

export const notifyError = ({ description, title }: ToastProps) => {
  toast({
    title: title || "Error",
    description,
    variant: "error",
  })
}
