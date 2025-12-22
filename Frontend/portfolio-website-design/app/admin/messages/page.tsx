"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Mail, Calendar as CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { apiGet, apiDelete } from "@/lib/http-client"

type Message = {
  _id: string
  senderName: string
  subject: string
  message: string
  createdAt: string
}

type MessagesResponse = {
  success: boolean
  messages: Message[]
}

async function fetchMessages(): Promise<Message[]> {
  const res = await apiGet<MessagesResponse>("/message/getall")
  return res.messages
}

async function deleteMessage(id: string): Promise<void> {
  await apiDelete(`/message/delete/${id}`)
}

export default function MessagesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] })
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
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
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">View and manage messages from your contact form</p>
      </div>

      {!messages || messages.length === 0 ? (
        <Card className="glass flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <Mail className="mb-4 h-12 w-12 opacity-50" />
          <h3 className="text-lg font-semibold">No messages yet</h3>
          <p>Messages sent from your portfolio contact form will appear here.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message._id} className="glass p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{message.senderName}</h3>
                  </div>
                  <h4 className="font-medium text-primary">{message.subject}</h4>
                  <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                  
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {message.createdAt ? format(new Date(message.createdAt), "PPP p") : "Unknown Date"}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                  onClick={() => handleDelete(message._id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
