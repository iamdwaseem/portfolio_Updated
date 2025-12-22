"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPortfolio, deleteApplication } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { ToolDialog } from "@/components/admin/tool-dialog"
import type { SoftwareApplication } from "@/lib/types"
import Image from "next/image"

export default function ToolsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<SoftwareApplication | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: "Tool deleted",
        description: "The tool has been removed successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tool.",
        variant: "destructive",
      })
    },
  })

  const handleEdit = (tool: SoftwareApplication) => {
    setEditingTool(tool)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTool(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tool?")) {
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
          <h1 className="mb-2 text-3xl font-bold">Tools Management</h1>
          <p className="text-muted-foreground">Manage your development tools and software applications</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data?.applications.map((tool) => (
          <Card key={tool.id} className="glass p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative h-16 w-16">
                <Image 
                  src={tool.icon || "/placeholder.svg"} 
                  alt={`${tool.name} logo`} 
                  fill 
                  className="object-contain" 
                />
              </div>
            </div>

            <h3 className="mb-4 font-semibold">{tool.name}</h3>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(tool)} className="flex-1 bg-transparent">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(tool.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ToolDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tool={editingTool}
        onSuccess={() => {
          setDialogOpen(false)
          setEditingTool(null)
        }}
      />
    </div>
  )
}
