"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Skill } from "@/lib/types"

interface SkillsSectionProps {
  skills: Skill[]
  onIntersect: () => void
}

export function SkillsSection({ skills, onIntersect }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleSkills, setVisibleSkills] = useState<number[]>([])

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
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleSkills((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    const skillCards = document.querySelectorAll(".skill-card")
    skillCards.forEach((card) => skillObserver.observe(card))

    return () => skillObserver.disconnect()
  }, [skills])

  return (
    <section ref={sectionRef} id="skills" className="bg-muted/30 py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Technical Skills</h2>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Expertise across modern web development technologies and frameworks
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <Card
              key={skill.id}
              data-index={index}
              className={`skill-card glass group p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                visibleSkills.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={skill.icon || "/placeholder.svg"}
                    alt={`${skill.name} icon`}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold">{skill.name}</h3>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{
                        width: visibleSkills.includes(index) ? `${skill.proficiency}%` : "0%",
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{skill.proficiency}% proficiency</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
