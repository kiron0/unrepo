"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"
import { notifyError } from "@/components/toast"

interface BatchActionsProps {
  selectedRepos: string[]
  repositoryCount: number
  onSelectAll: () => void
  onBatchDelete: () => void
  isBatchOpen: boolean
  setIsBatchOpen: (open: boolean) => void
}

export function BatchActions({
  selectedRepos,
  repositoryCount,
  onSelectAll,
  onBatchDelete,
  isBatchOpen,
  setIsBatchOpen,
}: BatchActionsProps) {
  const [inputValue, setInputValue] = useState("")
  const [pasteError, setPasteError] = useState("")

  const username = selectedRepos[0].split("/")[0]

  useEffect(() => {
    if (isBatchOpen) {
      setInputValue("")
      setPasteError("")
    }
  }, [isBatchOpen])

  if (selectedRepos.length === 0) return null

  return (
    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span className="font-medium">
            {selectedRepos.length} repositories selected
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSelectAll} variant="outline" size="sm">
            {selectedRepos.length === repositoryCount
              ? "Deselect All"
              : "Select All"}
          </Button>
          <AlertDialogHelper
            trigger={
              <Button variant="destructive" size="sm">
                <Trash2 />
                Delete Selected
              </Button>
            }
            title="Are you sure you want to delete selected repositories?"
            description={`This action cannot be undone. ${selectedRepos.length} repositories will be permanently deleted.`}
            func={() => {
              if (inputValue.toLowerCase() === username.toLowerCase()) {
                onBatchDelete()
                setInputValue("")
                setIsBatchOpen(false)
              } else {
                notifyError({
                  title: "Confirmation failed",
                  description: "Please type your GitHub username to confirm.",
                })
              }
            }}
            open={isBatchOpen}
            setOpen={setIsBatchOpen}
            disabled={inputValue.toLowerCase() !== username.toLowerCase()}
          >
            <div className="space-y-2">
              <Label htmlFor="verifyUsername">GitHub Username</Label>
              <Input
                id="verifyUsername"
                type="text"
                placeholder="Type your GitHub username to confirm"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (pasteError) setPasteError("")
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  setPasteError(
                    "Please type your username manually for security verification."
                  )
                }}
              />
              {pasteError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {pasteError}
                </p>
              )}
            </div>
          </AlertDialogHelper>
        </div>
      </div>
    </div>
  )
}
