"use client"

import { useData } from "@/lib/context/data-context"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { conversations } = useData()

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 border-b border-border hover:bg-secondary transition-colors text-left",
              selectedId === conv.id && "bg-secondary",
            )}
          >
            <div className="relative">
              <img
                src={conv.tutorAvatar || "/placeholder.svg"}
                alt={conv.tutorName}
                className="h-14 w-14 rounded-full object-cover"
              />
              {conv.unread > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate">{conv.tutorName}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(conv.lastMessageTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
