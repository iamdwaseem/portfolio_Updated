"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { SoftwareApplication } from "@/lib/types"

interface ToolsSectionProps {
  applications: SoftwareApplication[]
  onIntersect: () => void
}

export function ToolsSection({ applications, onIntersect }: ToolsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect()
          setVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersect])

  return (
    <section ref={sectionRef} id="tools" className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Tools & Technologies</h2>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            My daily toolkit for building exceptional web experiences
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          {applications.map((app, index) => (
            <div
              key={app.id}
              className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                animationName: visible ? "float" : "none",
                animationDuration: "3s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${index * 200}ms`,
              }}
            >
              <div className="relative h-16 w-16 transition-transform duration-300 hover:scale-110">
                <Image src={app.icon || "/placeholder.svg"} alt={`${app.name} logo`} fill className="object-contain" />
              </div>
              <span className="text-center text-sm font-medium">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
