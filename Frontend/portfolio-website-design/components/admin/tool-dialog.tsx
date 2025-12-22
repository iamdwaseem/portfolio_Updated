"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addApplication, updateApplication } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { SoftwareApplication } from "@/lib/types"

interface ToolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tool: SoftwareApplication | null
  onSuccess: () => void
}

export function ToolDialog({ open, onOpenChange, tool, onSuccess }: ToolDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
  })

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        icon: tool.icon,
      })
    } else {
      setFormData({
        name: "",
        icon: "",
      })
    }
  }, [tool, open])

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (tool) {
        await updateApplication(tool.id, data)
      } else {
        await addApplication(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: tool ? "Tool updated" : "Tool added",
        description: `The tool has been ${tool ? "updated" : "added"} successfully.`,
      })
      onSuccess()
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${tool ? "update" : "add"} tool.`,
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
          <DialogTitle>{tool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          <DialogDescription>
            {tool ? "Update the tool details below." : "Fill in the tool details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tool Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VS Code, Docker, Figma"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon URL</Label>
            <Input
              id="icon"
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="https://example.com/icon.png"
              required
            />
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
              ) : tool ? (
                "Update Tool"
              ) : (
                "Add Tool"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
