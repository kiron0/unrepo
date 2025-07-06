import type { Repository } from "@/types"
import { AlertTriangle } from "lucide-react"

import { RepoCard } from "./repo-card"
import type { FilterParams } from "./repo-filters"

interface RepositoriesListProps {
  repositories: Repository[]
  selectedRepos: string[]
  filters: FilterParams
  onToggleSelection: (fullName: string) => void
  onDelete: (fullName: string) => Promise<void>
}

export function RepositoriesList({
  repositories,
  selectedRepos,
  filters,
  onToggleSelection,
  onDelete,
}: RepositoriesListProps) {
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {repositories.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          isSelected={selectedRepos.includes(repo.full_name)}
          onToggleSelection={onToggleSelection}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
