"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { TimelineEntry } from "@/lib/types"

interface TimelineSectionProps {
  timelines: TimelineEntry[]
  onIntersect: () => void
}

export function TimelineSection({ timelines, onIntersect }: TimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleEntries, setVisibleEntries] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersect])

  useEffect(() => {
    const entryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleEntries((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    const timelineCards = document.querySelectorAll(".timeline-entry")
    timelineCards.forEach((card) => entryObserver.observe(card))

    return () => entryObserver.disconnect()
  }, [timelines])

  const formatDate = (date: string) => {
    if (date === "Present") return date
    const [year, month] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <section ref={sectionRef} id="timeline" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">My Journey</h2>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Professional experience and career milestones
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" aria-hidden="true" />

          <div className="space-y-12">
            {timelines.map((entry, index) => (
              <div
                key={entry.id}
                data-index={index}
                className={`timeline-entry relative ${index % 2 === 0 ? "pr-1/2" : "pl-1/2"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-8 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary" />

                <Card
                  className={`glass p-6 transition-all duration-700 ${
                    visibleEntries.includes(index)
                      ? "opacity-100 translate-x-0"
                      : index % 2 === 0
                        ? "opacity-0 -translate-x-8"
                        : "opacity-0 translate-x-8"
                  } ${index % 2 === 0 ? "mr-auto md:mr-8" : "ml-auto md:ml-8"}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(entry.fromDate)}</span>
                    <span>—</span>
                    <span>{formatDate(entry.toDate)}</span>
                  </div>
                  <h3 className="mb-1 text-xl font-bold">{entry.title}</h3>
                  <p className="mb-1 leading-relaxed text-muted-foreground">{entry.description}</p>
                  {(entry.educationYear || entry.cgpa) && (
                    <p className="text-sm text-muted-foreground">
                      {entry.educationYear && <span>Year: {entry.educationYear}</span>}
                      {entry.educationYear && entry.cgpa && <span className="mx-2">•</span>}
                      {entry.cgpa && <span>CGPA: {entry.cgpa}</span>}
                    </p>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
