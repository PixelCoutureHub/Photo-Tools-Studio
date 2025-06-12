"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Camera, Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/print-layout", label: "Print Layout", icon: "🖨️" },
    { href: "/resize", label: "Resize", icon: "📏" },
    { href: "/compress", label: "Compress", icon: "🗜️" },
    { href: "/kb-reducer", label: "KB Reducer", icon: "🎯" },
    { href: "/qr", label: "QR Generator", icon: "📱" },
    { href: "/contact", label: "Contact", icon: "📧" },
  ]

  return (
    <header
      className={`border-b border-white/20 dark:border-gray-800/50 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass dark:glass-dark shadow-xl backdrop-blur-xl"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <Camera className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-80">
              <Sparkles className="h-2 w-2 text-white m-0.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PhotoTools
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">Studio</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <span className="flex items-center space-x-2">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/20 dark:border-gray-800/50 glass dark:glass-dark">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-all duration-200 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
