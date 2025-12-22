"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPortfolio, deleteSkill } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { SkillDialog } from "@/components/admin/skill-dialog"
import type { Skill } from "@/lib/types"
import Image from "next/image"

export default function SkillsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: "Skill deleted",
        description: "The skill has been removed successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      })
    },
  })

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingSkill(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Skills Management</h1>
          <p className="text-muted-foreground">Manage your technical skills and proficiency levels</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.skills.map((skill) => (
          <Card key={skill.id} className="glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="relative h-12 w-12">
                <Image src={skill.icon || "/placeholder.svg"} alt={skill.name} fill className="object-contain" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">{skill.proficiency}%</span>
              </div>
            </div>

            <h3 className="mb-4 text-lg font-bold">{skill.name}</h3>

            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${skill.proficiency}%` }} />
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(skill)} className="flex-1 bg-transparent">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(skill.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <SkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skill={editingSkill}
        onSuccess={() => {
          setDialogOpen(false)
          setEditingSkill(null)
        }}
      />
    </div>
  )
}
