"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeSection: string
}

import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation({ activeSection }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const navLinks = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "timeline", label: "Journey" },
    { id: "tools", label: "Tools" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4 shadow-lg text-foreground" : "bg-transparent py-6 text-foreground"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <button 
          onClick={() => scrollToSection("hero")} 
          className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
        >
          Waseem's Portfolio
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden gap-1 md:flex">
            {navLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(link.id)}
                className={`${
                  activeSection === link.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground/80 hover:text-foreground"
                } transition-colors`}
              >
                {link.label}
              </Button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
