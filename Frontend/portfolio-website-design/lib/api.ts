import type { PortfolioData } from "./types"
import { apiGet, apiJsonPost, apiJsonPut, apiDelete, apiFormPost, apiFormPut } from "./http-client"

type ApiUserResponse = { success: boolean; user: any }
type ApiProjectsResponse = { success: boolean; projects: any[] }
type ApiSkillsResponse = { success: boolean; skills: any[] }
type ApiTimelineResponse = { success: boolean; timelines: any[] }
type ApiApplicationsResponse = { success: boolean; applications: any[] }

export async function fetchPortfolio(): Promise<PortfolioData> {
  const [userRes, projectsRes, skillsRes, timelinesRes, applicationsRes] = await Promise.all([
    apiGet<ApiUserResponse>("/user/me/portfolio"),
    apiGet<ApiProjectsResponse>("/projects/getAllProjects"),
    apiGet<ApiSkillsResponse>("/skill/getAllSkills"),
    apiGet<ApiTimelineResponse>("/timeline/getall"),
    apiGet<ApiApplicationsResponse>("/softwareapplication/getall"),
  ])

  return {
    user: {
      id: userRes.user._id,
      fullName: userRes.user.fullName,
      aboutMe: userRes.user.aboutMe,
      email: userRes.user.email,
      phone: userRes.user.phone,
      avatar: userRes.user.avatar?.url,
      resume: userRes.user.resume?.url,
      githubUrl: userRes.user.githubURL,
      linkedinUrl: userRes.user.linkedinURL,
      portfolioUrl: userRes.user.portfolioURL,
    },
    projects: projectsRes.projects.map((p) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      stack: p.stack || "Full Stack",
      technologies: Array.isArray(p.technologies)
        ? p.technologies
        : p.technologies
          ? String(p.technologies)
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      githubLink: p.gitRepoLink,
      liveLink: p.projectLink,
      bannerImage: p.projectBanner?.url,
      deployed: p.deployed || "Yes",
    })),
    skills: skillsRes.skills.map((s) => ({
      id: s._id,
      name: s.title,
      proficiency: Number(s.proficiencyLevel) || 0,
      icon: s.svg?.url,
    })),
    applications: applicationsRes.applications.map((a) => ({
      id: a._id,
      name: a.name,
      icon: a.svg?.url,
    })),
    timelines: timelinesRes.timelines.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      educationYear: t.educationYear ?? "",
      cgpa: t.cgpa ?? "",
      fromDate: t.timeline?.from ? new Date(t.timeline.from).toISOString().slice(0, 7) : "",
      toDate: t.timeline?.to ? new Date(t.timeline.to).toISOString().slice(0, 7) : "",
    })),
  }
}

export async function sendMessage(data: { name: string; email: string; message: string }): Promise<void> {
  await apiJsonPost("/message/send", {
    senderName: data.name,
    subject: `Message from ${data.name}`,
    message: data.message,
  })
}

export async function updateUser(data: Partial<PortfolioData["user"]>): Promise<void> {
  await apiJsonPut("/user/me/update", {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    aboutMe: data.aboutMe,
    githubURL: data.githubUrl,
    linkedinURL: data.linkedinUrl,
    portfolioURL: data.portfolioUrl,
  })
}

export async function updateProject(id: string, data: Partial<PortfolioData["projects"][0]>): Promise<void> {
  await apiJsonPut(`/projects/updateProject/${id}`, {
    title: data.title,
    description: data.description,
    githubRepoLink: data.githubLink,
    projectLink: data.liveLink,
    stack: data.stack,
    technologies: data.technologies,
    deployed: data.deployed,
    projectBanner: data.bannerImage,
  })
}

export async function addProject(data: Omit<PortfolioData["projects"][0], "id">): Promise<void> {
  await apiJsonPost("/projects/addNewProject", {
    title: data.title,
    description: data.description,
    githubRepoLink: data.githubLink,
    projectLink: data.liveLink,
    stack: data.stack,
    technologies: data.technologies,
    deployed: data.deployed,
    projectBanner: data.bannerImage,
  })
}

export async function deleteProject(id: string): Promise<void> {
  await apiDelete(`/projects/deleteProject/${id}`)
}

export async function addProjectWithFile(
  data: {
    title: string
    description: string
    stack: string
    technologies: string[]
    githubLink: string
    liveLink: string
    deployed: string
  },
  bannerFile: File
): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("githubRepoLink", data.githubLink)
  formData.append("projectLink", data.liveLink)
  formData.append("stack", data.stack)
  formData.append("technologies", data.technologies.join(","))
  formData.append("deployed", data.deployed)
  formData.append("projectBanner", bannerFile)
  await apiFormPost("/projects/addNewProject", formData)
}

export async function updateProjectWithFile(
  id: string,
  data: {
    title: string
    description: string
    stack: string
    technologies: string[]
    githubLink: string
    liveLink: string
    deployed: string
  },
  bannerFile: File | null
): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("githubRepoLink", data.githubLink)
  formData.append("projectLink", data.liveLink)
  formData.append("stack", data.stack)
  formData.append("technologies", data.technologies.join(","))
  formData.append("deployed", data.deployed)
  if (bannerFile) {
    formData.append("projectBanner", bannerFile)
  }
  await apiFormPut(`/projects/updateProject/${id}`, formData)
}

export async function updateSkill(id: string, data: Partial<PortfolioData["skills"][0]>): Promise<void> {
  await apiJsonPut(`/skill/updateSkill/${id}`, {
    title: data.name,
    proficiencyLevel: data.proficiency,
    svg: data.icon,
  })
}

export async function addSkill(data: Omit<PortfolioData["skills"][0], "id">): Promise<void> {
  await apiJsonPost("/skill/addSkill", {
    title: data.name,
    proficiencyLevel: data.proficiency,
    svg: data.icon,
  })
}

export async function deleteSkill(id: string): Promise<void> {
  await apiDelete(`/skill/deleteSkill/${id}`)
}

export async function addSkillWithFile(
  data: { name: string; proficiency: number },
  iconFile: File
): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.name)
  formData.append("proficiencyLevel", String(data.proficiency))
  formData.append("svg", iconFile)
  await apiFormPost("/skill/addSkill", formData)
}

export async function updateSkillWithFile(
  id: string,
  data: { name: string; proficiency: number },
  iconFile: File | null
): Promise<void> {
  const formData = new FormData()
  formData.append("title", data.name)
  formData.append("proficiencyLevel", String(data.proficiency))
  if (iconFile) {
    formData.append("svg", iconFile)
  }
  await apiFormPut(`/skill/updateSkill/${id}`, formData)
}

export async function updateTimeline(id: string, data: Partial<PortfolioData["timelines"][0]>): Promise<void> {
  await apiJsonPut(`/timeline/update/${id}`, {
    title: data.title,
    description: data.description,
    fromDate: data.fromDate,
    toDate: data.toDate,
    educationYear: data.educationYear,
    cgpa: data.cgpa,
  })
}

export async function addTimeline(data: Omit<PortfolioData["timelines"][0], "id">): Promise<void> {
  await apiJsonPost("/timeline/add", {
    title: data.title,
    description: data.description,
    fromDate: data.fromDate,
    toDate: data.toDate,
    educationYear: data.educationYear,
    cgpa: data.cgpa,
  })
}

export async function deleteTimeline(id: string): Promise<void> {
  await apiDelete(`/timeline/delete/${id}`)
}

export async function updateApplication(
  id: string,
  data: Partial<PortfolioData["applications"][0]>,
): Promise<void> {
  await apiJsonPut(`/softwareapplication/update/${id}`, {
    name: data.name,
    svg: data.icon,
  })
}

export async function addApplication(data: Omit<PortfolioData["applications"][0], "id">): Promise<void> {
  await apiJsonPost("/softwareapplication/add", {
    name: data.name,
    svg: data.icon,
  })
}

export async function deleteApplication(id: string): Promise<void> {
  await apiDelete(`/softwareapplication/delete/${id}`)
}
