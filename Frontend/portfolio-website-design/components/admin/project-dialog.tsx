"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addProjectWithFile, updateProjectWithFile } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSuccess: () => void
}

export function ProjectDialog({ open, onOpenChange, project, onSuccess }: ProjectDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stack: "",
    technologies: [] as string[],
    githubLink: "",
    liveLink: "",
    deployed: "Yes",
    techInput: "",
  })
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string>("")

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        stack: project.stack,
        technologies: project.technologies,
        githubLink: project.githubLink,
        liveLink: project.liveLink,
        deployed: project.deployed || "Yes",
        techInput: "",
      })
      setBannerPreview(project.bannerImage || "")
      setBannerFile(null)
    } else {
      setFormData({
        title: "",
        description: "",
        stack: "",
        technologies: [],
        githubLink: "",
        liveLink: "",
        deployed: "Yes",
        techInput: "",
      })
      setBannerPreview("")
      setBannerFile(null)
    }
  }, [project, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const preview = URL.createObjectURL(file)
      setBannerPreview(preview)
    }
  }

  const clearFile = () => {
    setBannerFile(null)
    setBannerPreview(project?.bannerImage || "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const { techInput, ...projectData } = formData
      if (project) {
        await updateProjectWithFile(project.id, projectData, bannerFile)
      } else {
        if (!bannerFile) {
          throw new Error("Banner image is required for new projects")
        }
        await addProjectWithFile(projectData, bannerFile)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: project ? "Project updated" : "Project added",
        description: `The project has been ${project ? "updated" : "added"} successfully.`,
      })
      onSuccess()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${project ? "update" : "add"} project.`,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!project && !bannerFile) {
      toast({
        title: "Error",
        description: "Please upload a banner image for the project.",
        variant: "destructive",
      })
      return
    }
    mutation.mutate()
  }

  const handleAddTechnology = () => {
    if (formData.techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, formData.techInput.trim()],
        techInput: "",
      })
    }
  }

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update the project details below." : "Fill in the project details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack">Stack</Label>
            <Input
              id="stack"
              value={formData.stack}
              onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
              placeholder="e.g., Full Stack, Frontend, Backend"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techInput">Technologies</Label>
            <div className="flex gap-2">
              <Input
                id="techInput"
                value={formData.techInput}
                onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                placeholder="Add a technology"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTechnology()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTechnology} variant="outline" className="bg-transparent">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span key={index} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1 text-sm">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Link</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveLink">Live Link</Label>
              <Input
                id="liveLink"
                type="url"
                value={formData.liveLink}
                onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">Banner Image</Label>
            <div className="flex items-start gap-4">
              {bannerPreview && (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-24 w-40 rounded-lg object-cover border"
                  />
                  {bannerFile && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="banner-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-transparent"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {bannerFile ? "Change Image" : project ? "Upload New Image" : "Upload Banner"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  {project ? "Leave empty to keep current image" : "PNG, JPG, or WebP"}
                </p>
              </div>
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
              ) : project ? (
                "Update Project"
              ) : (
                "Add Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
