"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, FileText, ArrowDown } from "lucide-react"
import type { User } from "@/lib/types"

interface HeroSectionProps {
  user: User
  onIntersect: () => void
}

export function HeroSection({ user, onIntersect }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersect])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
      <div
        className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto text-center">
        <div className="animate-fade-in space-y-8">
          {/* Avatar with glow */}
          <div className="relative mx-auto mb-8 h-32 w-32">
            <div className="absolute inset-0 animate-glow rounded-full bg-primary/20" />
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={`${user.fullName} profile picture`}
              width={128}
              height={128}
              className="relative rounded-full border-4 border-card object-cover"
            />
          </div>

          {/* Name with gradient */}
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {user.fullName}
          </h1>

          {/* Animated subtitle */}
          <p className="mx-auto max-w-2xl text-balance text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            {user.aboutMe}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={user.resume} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-5 w-5" />
                Resume
              </a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Scroll to projects"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  )
}
