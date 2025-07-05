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
  affiliation: string
  type: string
  visibility: string
  sort: string
  direction: string
  per_page: number
  page: number
}

interface RepoFiltersProps {
  filters: FilterParams
  onFilterChange: (key: keyof FilterParams, value: string | number) => void
  onSearch: (searchTerm: string) => void
  repositoryCount: number
  loading?: boolean
}

export function RepoFilters({
  filters,
  onFilterChange,
  onSearch,
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
    if (key === "type" && value !== "all") return true
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
      <SheetContent className="w-full max-w-xs">
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
                onValueChange={(value) => onFilterChange("affiliation", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="collaborator">Collaborator</SelectItem>
                  <SelectItem value="organization_member">
                    Organization Member
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => onFilterChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={filters.visibility}
                onValueChange={(value) => onFilterChange("visibility", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={`${filters.sort}-${filters.direction}`}
                onValueChange={(value) => {
                  const [sort, direction] = value.split("-")
                  onFilterChange("sort", sort)
                  onFilterChange("direction", direction)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="updated-asc">
                    Least Recently Updated
                  </SelectItem>
                  <SelectItem value="created-desc">Recently Created</SelectItem>
                  <SelectItem value="created-asc">Oldest Created</SelectItem>
                  <SelectItem value="pushed-desc">Recently Pushed</SelectItem>
                  <SelectItem value="pushed-asc">
                    Least Recently Pushed
                  </SelectItem>
                  <SelectItem value="full_name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="full_name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Items per page</Label>
              <Select
                value={filters.per_page.toString()}
                onValueChange={(value) => onFilterChange("per_page", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-sm">
              Showing {repositoryCount} repositories
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onFilterChange("search", "")
                  onFilterChange("affiliation", "owner")
                  onFilterChange("type", "all")
                  onFilterChange("visibility", "all")
                  onFilterChange("sort", "updated")
                  onFilterChange("direction", "desc")
                  onFilterChange("per_page", 30)
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
