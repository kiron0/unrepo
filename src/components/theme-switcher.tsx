"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

interface ThemeSwitcherProps {
  children: React.ReactNode
}

export function ThemeSwitcher({ children }: ThemeSwitcherProps) {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <main className="relative">
      {children}
      <div className="fixed right-2 bottom-2/3 z-50">
        <Button
          variant="outline"
          className="group/toggle h-8 w-8 rounded-full px-0"
          onClick={toggleTheme}
        >
          <SunIcon className="hidden [html.dark_&]:block" />
          <MoonIcon className="hidden [html.light_&]:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </main>
  )
}
