"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPortfolio } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, FileText, Image as ImageIcon } from "lucide-react"
import { getApiBase } from "@/lib/http-client"

export default function ProfilePage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  })

  const [formData, setFormData] = useState({
    fullName: "",
    aboutMe: "",
    email: "",
    phone: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (data?.user) {
      setFormData({
        fullName: data.user.fullName || "",
        aboutMe: data.user.aboutMe || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        githubUrl: data.user.githubUrl || "",
        linkedinUrl: data.user.linkedinUrl || "",
        portfolioUrl: data.user.portfolioUrl || "",
      })
      if (data.user.avatar) {
        setAvatarPreview(data.user.avatar)
      }
    }
  }, [data])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("aboutMe", formData.aboutMe)
      formDataToSend.append("githubURL", formData.githubUrl)
      formDataToSend.append("linkedinURL", formData.linkedinUrl)
      formDataToSend.append("portfolioURL", formData.portfolioUrl)
      
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile)
      }
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile)
      }

      const response = await fetch(`${getApiBase()}/user/me/update`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setAvatarFile(null)
      setResumeFile(null)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
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
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Profile Management</h1>
        <p className="text-muted-foreground">Update your personal information, avatar, and resume</p>
      </div>

      <Card className="glass max-w-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Label htmlFor="avatar-upload" className="font-semibold">Profile Picture / Hero Photo</Label>
              <div className="flex items-center gap-2">
                 <Input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="max-w-xs cursor-pointer"
                 />
              </div>
              <p className="text-xs text-muted-foreground">Recommended: Square JPG or PNG, max 2MB</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutMe">About Me</Label>
            <Textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
              rows={4}
              required
              className="resize-none bg-background/50"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://my-portfolio.com"
              className="bg-background/50"
            />
          </div>

          {/* Resume Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="resume-upload">Resume (PDF)</Label>
            <div className="flex flex-col gap-2">
                <Input 
                  id="resume-upload" 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  onChange={handleResumeChange} 
                   className="bg-background/50 cursor-pointer"
                />
                 {data?.user?.resume && (
                  <a href={data.user.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View Current Resume
                  </a>
                )}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}
