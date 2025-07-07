import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeftIcon, LogOut, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"

// Simple hook to track shift key state
function useShiftKey() {
  const [shiftPressed, setShiftPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.shiftKey) {
        setShiftPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" || !e.shiftKey) {
        setShiftPressed(false)
      }
    }

    const handleWindowBlur = () => {
      setShiftPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("keyup", handleKeyUp, true)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("keyup", handleKeyUp, true)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [])

  return shiftPressed
}

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
  const shiftPressed = useShiftKey()

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
          <br />
          {shiftPressed ? (
            <span className="text-xs opacity-80">
              🎯 <strong>Drag Selection Mode Active</strong> • Drag forward to
              select • Drag backward (↖️) to deselect
            </span>
          ) : (
            <>
              <span className="text-xs opacity-75">
                💡 Hold{" "}
                <kbd className="rounded border px-1 py-0.5 text-xs">Shift</kbd>{" "}
                and drag to select multiple repositories
              </span>
            </>
          )}
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
          disabled={loading}
          isLoading={loading}
        />
      </div>
    </div>
  )
}
