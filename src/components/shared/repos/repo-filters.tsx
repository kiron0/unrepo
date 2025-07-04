"use client"

import { Filter, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface RepositoryFiltersProps {
  filters: FilterParams
  onFilterChange: (key: keyof FilterParams, value: string | number) => void
  onSearch: (searchTerm: string) => void
  repositoryCount: number
}

export function RepositoryFilters({
  filters,
  onFilterChange,
  onSearch,
  repositoryCount,
}: RepositoryFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Repositories</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="search"
              placeholder="Search by name, description, topics..."
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Affiliation */}
          <div className="space-y-2">
            <Label>Affiliation</Label>
            <Select
              value={filters.affiliation}
              onValueChange={(value) => onFilterChange("affiliation", value)}
            >
              <SelectTrigger>
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

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFilterChange("type", value)}
            >
              <SelectTrigger>
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

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={filters.visibility}
              onValueChange={(value) => onFilterChange("visibility", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
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
              <SelectTrigger>
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
        </div>

        {/* Items per page */}
        <div className="flex items-center gap-4">
          <Label>Items per page:</Label>
          <Select
            value={filters.per_page.toString()}
            onValueChange={(value) => onFilterChange("per_page", value)}
          >
            <SelectTrigger className="w-20">
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
          <span className="text-muted-foreground text-sm">
            Showing {repositoryCount} repositories
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
