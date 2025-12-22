"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTimeline, updateTimeline } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { TimelineEntry } from "@/lib/types"

interface TimelineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: TimelineEntry | null
  onSuccess: () => void
}

export function TimelineDialog({ open, onOpenChange, entry, onSuccess }: TimelineDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
    educationYear: "",
    cgpa: "",
  })

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        description: entry.description,
        fromDate: entry.fromDate,
        toDate: entry.toDate,
        educationYear: entry.educationYear || "",
        cgpa: entry.cgpa || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        fromDate: "",
        toDate: "",
        educationYear: "",
        cgpa: "",
      })
    }
  }, [entry, open])

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (entry) {
        await updateTimeline(entry.id, data)
      } else {
        await addTimeline(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: entry ? "Timeline entry updated" : "Timeline entry added",
        description: `The entry has been ${entry ? "updated" : "added"} successfully.`,
      })
      onSuccess()
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${entry ? "update" : "add"} timeline entry.`,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Timeline Entry" : "Add Timeline Entry"}</DialogTitle>
          <DialogDescription>
            {entry ? "Update the timeline entry details below." : "Fill in the timeline entry details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Full-Stack Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe your role, responsibilities, and achievements"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="month"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="month"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                placeholder="Leave empty for Present"
              />
              <p className="text-xs text-muted-foreground">Leave empty or type "Present" for current position</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="educationYear">College / Academic Year (optional)</Label>
              <Input
                id="educationYear"
                value={formData.educationYear}
                onChange={(e) => setFormData({ ...formData, educationYear: e.target.value })}
                placeholder="e.g., 2019 - 2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA (optional)</Label>
              <Input
                id="cgpa"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g., 8.5 / 10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : entry ? (
                "Update Entry"
              ) : (
                "Add Entry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
