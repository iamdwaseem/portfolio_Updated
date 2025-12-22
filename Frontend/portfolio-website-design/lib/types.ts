export interface User {
  id: string
  fullName: string
  aboutMe: string
  email: string
  phone: string
  avatar: string
  resume: string
  githubUrl: string
  linkedinUrl: string
  portfolioUrl: string
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string
  technologies: string[]
  githubLink: string
  liveLink: string
  bannerImage: string
  deployed: string
}

export interface Skill {
  id: string
  name: string
  proficiency: number // 0-100
  icon: string
}

export interface SoftwareApplication {
  id: string
  name: string
  icon: string
}

export interface TimelineEntry {
  id: string
  title: string
  description: string
  fromDate: string
  toDate: string
  educationYear?: string
  cgpa?: string
}

export interface PortfolioData {
  user: User
  projects: Project[]
  skills: Skill[]
  applications: SoftwareApplication[]
  timelines: TimelineEntry[]
}
