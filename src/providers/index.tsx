import { ThemeProvider } from "@/providers/theme-provider"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/toaster"
import { ThemeSwitcher } from "@/components/theme-switcher"

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
        <ThemeSwitcher>{children}</ThemeSwitcher>
      </ThemeProvider>
      <Toaster />
      <NextTopLoader showForHashAnchor={false} />
    </>
  )
}
