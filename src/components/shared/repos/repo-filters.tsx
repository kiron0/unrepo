"use client"

import { useEffect, useState } from "react"
import { Filter, Search, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface FilterParams {
  search: string
  affiliation: "owner" | "collaborator" | "organization_member"
  visibility: "all" | "public" | "private"
  sort: "created" | "updated" | "pushed" | "full_name"
  direction: "asc" | "desc"
  per_page: 10 | 25 | 30 | 50 | 100
  page: number
}

export const AFFILIATION_OPTIONS: {
  value: FilterParams["affiliation"]
  label: string
}[] = [
  { value: "owner", label: "Owner" },
  { value: "collaborator", label: "Collaborator" },
  { value: "organization_member", label: "Organization Member" },
]

export const VISIBILITY_OPTIONS: {
  value: FilterParams["visibility"]
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
]

export const SORT_OPTIONS: {
  value: `${FilterParams["sort"]}-${FilterParams["direction"]}`
  label: string
}[] = [
  { value: "updated-desc", label: "Recently Updated" },
  { value: "updated-asc", label: "Least Recently Updated" },
  { value: "created-desc", label: "Recently Created" },
  { value: "created-asc", label: "Oldest Created" },
  { value: "pushed-desc", label: "Recently Pushed" },
  { value: "pushed-asc", label: "Least Recently Pushed" },
  { value: "full_name-asc", label: "Name (A-Z)" },
  { value: "full_name-desc", label: "Name (Z-A)" },
]

export const PER_PAGE_OPTIONS: {
  value: FilterParams["per_page"]
  label: string
}[] = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 30, label: "30" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
]

interface RepoFiltersProps {
  filters: FilterParams
  onFilterChange: (key: keyof FilterParams, value: string | number) => void
  onFiltersChange: (updates: Partial<FilterParams>) => void
  onSearch: (searchTerm: string) => void
  onClearFilters: () => void
  repositoryCount: number
  loading?: boolean
}

export function RepoFilters({
  filters,
  onFilterChange,
  onFiltersChange,
  onSearch,
  onClearFilters,
  repositoryCount,
  loading = false,
}: RepoFiltersProps) {
  const [localSearchValue, setLocalSearchValue] = useState(filters.search)

  useEffect(() => {
    setLocalSearchValue(filters.search)
  }, [filters.search])

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search" && value) return true
    if (key === "affiliation" && value !== "owner") return true
    if (key === "visibility" && value !== "all") return true
    if (key === "sort" && value !== "updated") return true
    if (key === "direction" && value !== "desc") return true
    if (key === "per_page" && value !== 30) return true
    return false
  }).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4" />
          Filters & Search
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] md:w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </SheetTitle>
          <SheetDescription>
            Search and filter your repositories
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSearch(localSearchValue)
              }}
              className="relative flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="search"
                  placeholder="Search by name, description, topics..."
                  value={localSearchValue}
                  onChange={(e) => setLocalSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filters.search && repositoryCount > 0 ? (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    setLocalSearchValue("")
                    onFilterChange("search", "")
                  }}
                  disabled={loading}
                >
                  Clear
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  <SearchIcon />
                </Button>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 gap-4 space-y-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Affiliation</Label>
              <Select
                value={filters.affiliation}
                onValueChange={(value: FilterParams["affiliation"]) =>
                  onFilterChange("affiliation", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AFFILIATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={filters.visibility}
                onValueChange={(value: FilterParams["visibility"]) =>
                  onFilterChange("visibility", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={`${filters.sort}-${filters.direction}`}
                onValueChange={(value) => {
                  const [sort, direction] = value?.split("-") as [
                    FilterParams["sort"],
                    FilterParams["direction"],
                  ]
                  onFiltersChange({ sort, direction })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Items per page</Label>
              <Select
                value={filters.per_page.toString()}
                onValueChange={(value) =>
                  onFilterChange(
                    "per_page",
                    parseInt(value) as FilterParams["per_page"]
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-sm">
              Showing {repositoryCount} repositories
            </span>
            {activeFiltersCount > 0 && (
              <Button variant="destructive" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
