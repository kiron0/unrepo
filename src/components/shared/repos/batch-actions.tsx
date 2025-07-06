import { AlertTriangle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"

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
            func={onBatchDelete}
            open={isBatchOpen}
            setOpen={setIsBatchOpen}
          />
        </div>
      </div>
    </div>
  )
}
