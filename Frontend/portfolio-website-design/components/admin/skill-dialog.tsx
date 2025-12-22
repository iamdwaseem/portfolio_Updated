"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addSkillWithFile, updateSkillWithFile } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import type { Skill } from "@/lib/types"

interface SkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
  onSuccess: () => void
}

export function SkillDialog({ open, onOpenChange, skill, onSuccess }: SkillDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    proficiency: 50,
  })
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>("")

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        proficiency: skill.proficiency,
      })
      setIconPreview(skill.icon || "")
      setIconFile(null)
    } else {
      setFormData({
        name: "",
        proficiency: 50,
      })
      setIconPreview("")
      setIconFile(null)
    }
  }, [skill, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIconFile(file)
      const preview = URL.createObjectURL(file)
      setIconPreview(preview)
    }
  }

  const clearFile = () => {
    setIconFile(null)
    setIconPreview(skill?.icon || "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (skill) {
        await updateSkillWithFile(skill.id, formData, iconFile)
      } else {
        if (!iconFile) {
          throw new Error("Icon file is required for new skills")
        }
        await addSkillWithFile(formData, iconFile)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: skill ? "Skill updated" : "Skill added",
        description: `The skill has been ${skill ? "updated" : "added"} successfully.`,
      })
      onSuccess()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${skill ? "update" : "add"} skill.`,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!skill && !iconFile) {
      toast({
        title: "Error",
        description: "Please upload an icon for the skill.",
        variant: "destructive",
      })
      return
    }
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          <DialogDescription>
            {skill ? "Update the skill details below." : "Fill in the skill details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., React, TypeScript, Node.js"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Skill Icon</Label>
            <div className="flex items-center gap-4">
              {iconPreview && (
                <div className="relative">
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="h-16 w-16 rounded-lg object-contain border bg-muted p-1"
                  />
                  {iconFile && (
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
                  accept="image/*,.svg"
                  onChange={handleFileChange}
                  className="hidden"
                  id="icon-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-transparent"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {iconFile ? "Change Icon" : skill ? "Upload New Icon" : "Upload Icon"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  {skill ? "Leave empty to keep current icon" : "PNG, JPG, or SVG"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Proficiency Level</Label>
              <span className="text-2xl font-bold">{formData.proficiency}%</span>
            </div>
            <Slider
              value={[formData.proficiency]}
              onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
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
              ) : skill ? (
                "Update Skill"
              ) : (
                "Add Skill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
