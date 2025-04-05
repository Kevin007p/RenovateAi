"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatWindowProps {
  description: string
  timeline: string
  currentImages: File[]
  desiredImages: File[]
  onClose: () => void
}

export function ChatWindow({ description, timeline, currentImages, desiredImages, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize conversation with AI
    const initializeChat = async () => {
      setIsTyping(true)
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            timeline,
            currentImages: currentImages.length,
            desiredImages: desiredImages.length,
            isInitial: true
          })
        })

        if (!response.ok) throw new Error("Failed to initialize chat")

        const data = await response.json()
        setConversationId(data.conversationId)
        setMessages([{ role: "assistant", content: data.message }])
      } catch (error) {
        console.error("Error initializing chat:", error)
        setMessages([{ role: "assistant", content: "I apologize, but I'm having trouble starting our conversation. Please try again." }])
      } finally {
        setIsTyping(false)
      }
    }

    initializeChat()
  }, [description, timeline, currentImages.length, desiredImages.length])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          description,
          timeline,
          currentImages: currentImages.length,
          desiredImages: desiredImages.length
        })
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I'm having trouble responding. Please try again." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Chat with AI</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-[#79072f] text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" className="bg-[#79072f] hover:bg-[#5e0624] text-white">
          Send
        </Button>
      </form>
    </div>
  )
}

