"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeSection: string
}

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
        scrolled ? "glass py-4 shadow-lg" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <button onClick={() => scrollToSection("hero")} className="text-xl font-bold tracking-tight">
          Waseem's Portfolio
        </button>
        <div className="hidden gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(link.id)}
              className={`${
                activeSection === link.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-colors`}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
