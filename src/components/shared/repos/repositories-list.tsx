import type { Repository } from "@/types"
import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDragSelection } from "@/hooks/use-drag-selection"

import { RepoCard } from "./repo-card"
import type { FilterParams } from "./repo-filters"

interface RepositoriesListProps {
  repositories: Repository[]
  selectedRepos: string[]
  filters: FilterParams
  onToggleSelection: (fullName: string) => void
  onDelete: (fullName: string) => Promise<void>
  onDragSelection: (selectedIds: string[]) => void
}

export function RepositoriesList({
  repositories,
  selectedRepos,
  filters,
  onToggleSelection,
  onDelete,
  onDragSelection,
}: RepositoriesListProps) {
  const {
    containerRef,
    registerItemRef,
    handleMouseDown,
    isSelecting,
    getSelectionBoxStyle,
    shiftPressed,
  } = useDragSelection({
    items: repositories,
    selectedItems: selectedRepos,
    onSelectionChange: onDragSelection,
    getItemId: (repo) => repo.full_name,
  })
  if (
    !repositories ||
    !Array.isArray(repositories) ||
    repositories.length === 0
  ) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-xl border text-center">
        <AlertTriangle className="text-destructive size-12" />
        <p className="text-muted-foreground">
          {filters.search
            ? `No repositories found matching "${filters.search}"`
            : "No repositories found"}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-1 gap-4 transition-all duration-200 lg:grid-cols-2 xl:grid-cols-3",
        shiftPressed ? "cursor-crosshair" : "cursor-default",
        isSelecting ? "select-none" : ""
      )}
      onMouseDown={(e) => {
        if (shiftPressed) {
          e.preventDefault()
          handleMouseDown(e)
        }
      }}
      style={{
        userSelect: shiftPressed || isSelecting ? "none" : "auto",
      }}
    >
      {repositories.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          isSelected={selectedRepos.includes(repo.full_name)}
          onToggleSelection={onToggleSelection}
          onDelete={onDelete}
          registerRef={(element) => registerItemRef(repo.full_name, element)}
          isDragSelecting={isSelecting}
          shiftPressed={shiftPressed}
        />
      ))}

      {isSelecting && (
        <div
          style={{
            ...getSelectionBoxStyle(),
            animation: "fadeInScale 0.1s ease-out",
          }}
        />
      )}
    </div>
  )
}
