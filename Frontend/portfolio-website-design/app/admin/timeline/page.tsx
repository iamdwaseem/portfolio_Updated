"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPortfolio, deleteTimeline } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { TimelineDialog } from "@/components/admin/timeline-dialog"
import type { TimelineEntry } from "@/lib/types"

export default function TimelinePage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: "Timeline entry deleted",
        description: "The entry has been removed successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete timeline entry.",
        variant: "destructive",
      })
    },
  })

  const handleEdit = (entry: TimelineEntry) => {
    setEditingEntry(entry)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingEntry(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this timeline entry?")) {
      deleteMutation.mutate(id)
    }
  }

  const formatDate = (date: string) => {
    if (date === "Present") return date
    const [year, month] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
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
          <h1 className="mb-2 text-3xl font-bold">Timeline Management</h1>
          <p className="text-muted-foreground">Manage your professional journey and milestones</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2" />

        <div className="space-y-8">
          {data?.timelines.map((entry, index) => (
            <div key={entry.id} className={`relative ${index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:ml-auto"}`}>
              <div className="absolute left-8 top-8 h-4 w-4 rounded-full border-4 border-background bg-primary md:left-1/2 md:-translate-x-1/2" />

              <Card className="glass ml-16 p-6 md:ml-0">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(entry.fromDate)}</span>
                  <span>—</span>
                  <span>{formatDate(entry.toDate)}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold">{entry.title}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">{entry.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(entry)}
                    className="flex-1 bg-transparent"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <TimelineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSuccess={() => {
          setDialogOpen(false)
          setEditingEntry(null)
        }}
      />
    </div>
  )
}
