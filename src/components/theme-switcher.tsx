"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <div className={cn(className)}>
      <Button
        variant="ghost"
        className="group/toggle h-8 w-8 px-0"
        onClick={toggleTheme}
      >
        <SunIcon className="hidden [html.dark_&]:block" />
        <MoonIcon className="hidden [html.light_&]:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
