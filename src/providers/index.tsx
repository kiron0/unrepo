import { ThemeProvider } from "@/providers/theme-provider"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <main>{children}</main>
      </ThemeProvider>
      <Toaster />
      <NextTopLoader showForHashAnchor={false} />
    </>
  )
}
