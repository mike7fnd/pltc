"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useData } from "@/lib/context/data-context"
import { AirbnbButton } from "../ui/airbnb-button"
import { cn } from "@/lib/utils"
import { Send, Paperclip, ImageIcon } from "lucide-react"

interface ChatInterfaceProps {
  conversationId: string
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { user } = useAuth()
  const { messages, conversations, sendMessage } = useData()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = conversations.find((c) => c.id === conversationId)
  const conversationMessages = messages.filter((m) => m.conversationId === conversationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationMessages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    sendMessage(conversationId, {
      senderId: user?.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    })
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a conversation to start messaging
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <img
          src={conversation.tutorAvatar || "/placeholder.svg"}
          alt={conversation.tutorName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{conversation.tutorName}</h3>
          <p className="text-sm text-muted-foreground">Usually responds within 1 hour</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversationMessages.map((message) => {
          const isOwn = message.senderId === user?.id || message.senderId === "parent_1"
          return (
            <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] px-4 py-3 rounded-2xl",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className={cn("text-xs mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full min-h-[48px] max-h-32 px-4 py-3 pr-24 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <AirbnbButton onClick={handleSend} size="lg" className="rounded-xl">
            <Send className="h-5 w-5" />
          </AirbnbButton>
        </div>
      </div>
    </div>
  )
}
