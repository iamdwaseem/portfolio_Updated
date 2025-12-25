"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPortfolio, fetchStaticPortfolio } from "@/lib/api"
import { HeroSection } from "./portfolio/hero-section"
import { ProjectsSection } from "./portfolio/projects-section"
import { SkillsSection } from "./portfolio/skills-section"
import { TimelineSection } from "./portfolio/timeline-section"
import { ToolsSection } from "./portfolio/tools-section"
import { ContactSection } from "./portfolio/contact-section"
import { Navigation } from "./portfolio/navigation"
import { BackendWakingMessage } from "./backend-waking-message"
import { useState, useEffect } from "react"
import type { PortfolioData } from "@/lib/types"

export function PublicPortfolio() {
  const [staticData, setStaticData] = useState<PortfolioData | null>(null)
  
  const { data: backendData, isLoading: isQueryLoading, isError } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    retry: 10, // Retry up to 10 times (good for waking up cold backend)
    retryDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 30000), // Exponential backoff up to 30s
  })

  useEffect(() => {
    fetchStaticPortfolio().then(setStaticData)
  }, [])

  const [activeSection, setActiveSection] = useState("hero")

  const data = backendData || staticData
  const isUsingStatic = !!staticData && !backendData

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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
      {isUsingStatic && <BackendWakingMessage />}
    </>
  )
}
