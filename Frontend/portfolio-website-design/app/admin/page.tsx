"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPortfolio } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Users, FolderGit2, Award, Briefcase } from "lucide-react"

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const stats = [
    {
      title: "Projects",
      value: data?.projects.length || 0,
      icon: FolderGit2,
      color: "text-blue-600",
    },
    {
      title: "Skills",
      value: data?.skills.length || 0,
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "Timeline Entries",
      value: data?.timelines.length || 0,
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Tools",
      value: data?.applications.length || 0,
      icon: Users,
      color: "text-orange-600",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Manage your portfolio content from one place</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="glass mt-8 p-6">
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <p className="text-muted-foreground">
          Use the sidebar navigation to manage your profile, projects, skills, timeline, and tools. All changes are
          saved automatically and will be reflected on your public portfolio.
        </p>
      </Card>
    </div>
  )
}
