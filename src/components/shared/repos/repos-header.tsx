import Link from "next/link"
import { ChevronLeftIcon, LogOut, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"

interface ReposHeaderProps {
  onRefresh: () => void
  onLogout: () => void
  loading: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function ReposHeader({
  onRefresh,
  onLogout,
  loading,
  isOpen,
  setIsOpen,
}: ReposHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-5 md:flex-row md:justify-between">
      <div className="w-full">
        <Link
          href="/"
          className="from-primary to-secondary flex items-center bg-gradient-to-tr bg-clip-text text-xl font-bold text-transparent md:text-2xl"
        >
          <ChevronLeftIcon className="text-muted-foreground" />
          GitHub Repositories
        </Link>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage repositories with filters, search, and batch operations.
        </p>
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button onClick={onRefresh} disabled={loading} variant="outline">
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </Button>
        <AlertDialogHelper
          trigger={
            <Button className="w-full" variant="destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          }
          title="Are you sure you want to logout?"
          description="You will be redirected to the home page."
          func={onLogout}
          open={isOpen}
          setOpen={setIsOpen}
        />
      </div>
    </div>
  )
}
