"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, User, FolderGit2, Award, Calendar, Wrench, LogOut, Menu, X, Home, Mail } from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/profile", label: "Profile", icon: User },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/skills", label: "Skills", icon: Award },
    { href: "/admin/timeline", label: "Timeline", icon: Calendar },
    { href: "/admin/tools", label: "Tools", icon: Wrench },
    { href: "/admin/messages", label: "Messages", icon: Mail },
  ]

  const handleLogout = async () => {
    if (window.innerWidth < 1024) {
      onToggle(false)
    }
    await logout()
    router.push("/")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    // Only close on mobile/tablet
    if (window.innerWidth < 1024) {
      onToggle(false)
    }
  }

  // Auto-detect screen size and set sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Large screens: always show sidebar
        onToggle(true)
      } else {
        // Small screens: hide by default
        onToggle(false)
      }
    }

    // Set initial state
    handleResize()

    // Listen for window resize
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [onToggle])

  return (
    <>
      {/* Toggle Button - Only visible on small/medium screens */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={() => onToggle(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`glass fixed inset-y-0 left-0 z-40 w-64 transform border-r transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b p-6 lg:pt-6 pt-20">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-primary/10 text-primary" : ""}`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Footer Actions */}
          <div className="space-y-2 border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-3 h-5 w-5" />
              View Public Site
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={() => onToggle(false)} 
          aria-hidden="true" 
        />
      )}
    </>
  )
}
