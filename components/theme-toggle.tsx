"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-blue-50 dark:hover:bg-blue-950/20">
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <Sun className="h-4 w-4 text-orange-600" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass dark:glass-dark border-0 shadow-xl">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
        >
          <Sun className="mr-2 h-4 w-4 text-orange-600" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-600" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
        >
          <Monitor className="mr-2 h-4 w-4 text-gray-600" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
