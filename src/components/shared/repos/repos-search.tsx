import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RepoFilters, type FilterParams } from "./repo-filters"

interface ReposSearchProps {
  filters: FilterParams
  onFilterChange: (key: keyof FilterParams, value: string | number) => void
  onSearch: (searchTerm: string) => void
  repositoryCount: number
  loading: boolean
  fetchRepositories: (forceRefresh: boolean, filters: FilterParams) => void
}

export function ReposSearch({
  filters,
  onFilterChange,
  onSearch,
  repositoryCount,
  loading,
  fetchRepositories,
}: ReposSearchProps) {
  const [searchValue, setSearchValue] = useState(filters.search)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchValue)
  }

  const handleClear = () => {
    setSearchValue("")
    fetchRepositories(true, { ...filters, search: "" })
  }

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between lg:justify-end">
        <form
          onSubmit={handleSubmit}
          className="relative flex w-full max-w-md gap-2"
        >
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Quick search repositories..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          {filters.search && repositoryCount > 0 ? (
            <Button
              variant="destructive"
              type="button"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          )}
        </form>
        <RepoFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onSearch={onSearch}
          repositoryCount={repositoryCount}
          loading={loading}
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Showing {repositoryCount} repositories
      </p>
    </div>
  )
}
