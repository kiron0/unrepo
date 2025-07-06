"use client"

import { Suspense, useState } from "react"

import { useRepositories } from "@/hooks/use-repositories"

import { BatchActions } from "./batch-actions"
import { LoadingState } from "./loading-state"
import { RepoPagination } from "./repo-pagination"
import { ReposHeader } from "./repos-header"
import { ReposSearch } from "./repos-search"
import { RepositoriesList } from "./repositories-list"

function ReposSuspense() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)

  const {
    repositories,
    loading,
    selectedRepos,
    totalPages,
    isLoggingOut,
    filters,
    refreshRepositories,
    handleFilterChange,
    handleSearch,
    deleteRepository,
    batchDeleteRepositories,
    handleLogout,
    toggleRepoSelection,
    selectAllRepos,
    fetchRepositories,
  } = useRepositories()

  return (
    <div className="container mx-auto p-6">
      <ReposHeader
        onRefresh={refreshRepositories}
        onLogout={handleLogout}
        loading={loading}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <ReposSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        repositoryCount={repositories.length}
        loading={loading}
        fetchRepositories={fetchRepositories}
      />
      <BatchActions
        selectedRepos={selectedRepos}
        repositoryCount={repositories.length}
        onSelectAll={selectAllRepos}
        onBatchDelete={async () => {
          const success = await batchDeleteRepositories()
          if (success) {
            setIsBatchOpen(false)
          }
        }}
        isBatchOpen={isBatchOpen}
        setIsBatchOpen={setIsBatchOpen}
      />
      {loading || isLoggingOut ? (
        <LoadingState isLoggingOut={isLoggingOut} />
      ) : (
        <>
          <RepositoriesList
            repositories={repositories}
            selectedRepos={selectedRepos}
            filters={filters}
            onToggleSelection={toggleRepoSelection}
            onDelete={deleteRepository}
          />
          <RepoPagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange("page", page)}
          />
        </>
      )}
    </div>
  )
}

export function Repos() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-t-primary border-muted h-12 w-12 animate-spin rounded-full border-4" />
        </div>
      }
    >
      <ReposSuspense />
    </Suspense>
  )
}
