import { RefreshCw } from "lucide-react"

interface LoadingStateProps {
  isLoggingOut: boolean
}

export function LoadingState({ isLoggingOut }: LoadingStateProps) {
  return (
    <div className="py-16 text-center">
      <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin" />
      <p>{isLoggingOut ? "Logging out..." : "Loading repositories..."}</p>
    </div>
  )
}
