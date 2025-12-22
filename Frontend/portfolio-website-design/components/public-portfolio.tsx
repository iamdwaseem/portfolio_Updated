"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPortfolio } from "@/lib/api"
import { HeroSection } from "./portfolio/hero-section"
import { ProjectsSection } from "./portfolio/projects-section"
import { SkillsSection } from "./portfolio/skills-section"
import { TimelineSection } from "./portfolio/timeline-section"
import { ToolsSection } from "./portfolio/tools-section"
import { ContactSection } from "./portfolio/contact-section"
import { Navigation } from "./portfolio/navigation"
import { useState } from "react"

export function PublicPortfolio() {
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const [activeSection, setActiveSection] = useState("hero")

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!data) return null

  return (
    <>
      <Navigation activeSection={activeSection} />
      <main>
        <HeroSection user={data.user} onIntersect={() => setActiveSection("hero")} />
        <ProjectsSection projects={data.projects} onIntersect={() => setActiveSection("projects")} />
        <SkillsSection skills={data.skills} onIntersect={() => setActiveSection("skills")} />
        <TimelineSection timelines={data.timelines} onIntersect={() => setActiveSection("timeline")} />
        <ToolsSection applications={data.applications} onIntersect={() => setActiveSection("tools")} />
        <ContactSection onIntersect={() => setActiveSection("contact")} />
      </main>
    </>
  )
}
