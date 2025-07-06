interface LoadingStateProps {
  isLoggingOut: boolean
}

export function LoadingState({ isLoggingOut }: LoadingStateProps) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4">
      <div className="border-t-primary border-muted size-10 animate-spin rounded-full border-2 md:size-12 md:border-3" />
      <p className="animate-pulse text-sm font-medium md:text-base">
        {isLoggingOut ? "Logging out..." : "Loading repositories..."}
      </p>
    </div>
  )
}
