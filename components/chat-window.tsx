"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ArrowDown, ThumbsUp, Clock, ThumbsDown } from "lucide-react"
import { ContactPopup } from "./ContactPopup"
import { NotInterestedPopup } from "./NotInterestedPopup"
import { saveProject } from '@/lib/saveProject'
import { useRouter } from 'next/navigation'

interface Message {
  role: "user" | "assistant"
  content: string
  priceRange?: { min: number; max: number }
}

interface ChatWindowProps {
  description: string
  timeline: string
  currentImages: File[]
  desiredImages: File[]
  onClose: () => void
  onDecision?: (decision: 'interested' | 'thinking' | 'not_interested') => void
}

export function ChatWindow({ description, timeline, currentImages, desiredImages, onClose, onDecision }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showDecisionButtons, setShowDecisionButtons] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [showNotInterestedPopup, setShowNotInterestedPopup] = useState(false)
  const [interestStatus, setInterestStatus] = useState<'interested' | 'thinking' | 'not_interested' | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowScrollButton(false)
  }

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize conversation with AI
    const initializeChat = async () => {
      setIsTyping(true)
      try {
        // Convert images to base64
        const currentBase64Images = await Promise.all(
          currentImages.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
          })
        );

        const desiredBase64Images = await Promise.all(
          desiredImages.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
          })
        );

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            timeline,
            currentImages: currentBase64Images,
            desiredImages: desiredBase64Images,
            isInitial: true
          })
        })

        if (!response.ok) throw new Error("Failed to initialize chat")

        const data = await response.json()
        setConversationId(data.conversationId)
        setMessages([{ 
          role: "assistant", 
          content: data.message,
          priceRange: data.priceRange
        }])
        setShowDecisionButtons(true)
      } catch (error) {
        console.error("Error initializing chat:", error)
        setMessages([{ role: "assistant", content: "I apologize, but I'm having trouble starting our conversation. Please try again." }])
      } finally {
        setIsTyping(false)
      }
    }

    initializeChat()
  }, [description, timeline, currentImages, desiredImages])

  const handleDecision = async (decision: 'interested' | 'thinking' | 'not_interested') => {
    if (onDecision) {
      onDecision(decision)
    }
    
    setInterestStatus(decision)
    
    // Get the latest price range from messages
    const lastMessageWithPrice = [...messages].reverse().find(msg => msg.priceRange)
    const priceRange = lastMessageWithPrice?.priceRange

    try {
      // Save project data to Supabase
      await saveProject({
        renovationType: description.toLowerCase().includes('kitchen') ? 'kitchen' :
                       description.toLowerCase().includes('bathroom') ? 'bathroom' :
                       description.toLowerCase().includes('basement') ? 'basement' :
                       description.toLowerCase().includes('garden') ? 'garden' :
                       description.toLowerCase().includes('roof') ? 'roof' : 'other',
        initialPrompt: description,
        minPrice: priceRange?.min,
        maxPrice: priceRange?.max,
        interestLevel: decision,
        estimatedTimeline: timeline || undefined,
        currentImages,
        desiredImages,
      })
    } catch (error) {
      console.error('Error saving project:', error)
      // Continue with the flow even if save fails
    }
    
    if (decision === 'interested' || decision === 'thinking') {
      setShowContactPopup(true)
    } else if (decision === 'not_interested') {
      setShowNotInterestedPopup(true)
    }
    
    setShowDecisionButtons(false)
    setInput("")
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversationId) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsTyping(true)
    setShowDecisionButtons(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          description,
          timeline,
          currentImages: currentImages.map(file => URL.createObjectURL(file)),
          desiredImages: desiredImages.map(file => URL.createObjectURL(file)),
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            priceRange: msg.priceRange
          }))
        })
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.message,
        priceRange: data.priceRange || prev[prev.length - 1]?.priceRange
      }])
      setShowDecisionButtons(true)
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble responding. Please try again.",
        priceRange: prev[prev.length - 1]?.priceRange
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePopupClose = () => {
    setShowContactPopup(false)
    setShowNotInterestedPopup(false)
    onClose()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <div className="flex flex-col h-[600px] relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chat with RenovateAI</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.priceRange && (
                  <div className="mt-2 p-2 bg-white/10 rounded-lg">
                    <div className="text-sm font-medium text-[#79072f]">
                      Estimated Price Range
                    </div>
                    <div className="text-lg font-bold">
                      ${message.priceRange.min.toLocaleString()} - ${message.priceRange.max.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-gray-500">RenovateAI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 bg-white border-2 border-[#79072f] text-[#79072f] rounded-full p-2 hover:bg-gray-50 shadow-lg"
            size="icon"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}

        {showDecisionButtons && (
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={() => handleDecision('interested')}
              className="flex-1 bg-[#79072f] hover:bg-[#5e0624] text-white"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              I'm Interested
            </Button>
            <Button 
              onClick={() => handleDecision('thinking')}
              className="flex-1 bg-[#79072f] hover:bg-[#5e0624] text-white"
            >
              <Clock className="mr-2 h-4 w-4" />
              Still Thinking
            </Button>
            <Button 
              onClick={() => handleDecision('not_interested')}
              className="flex-1 bg-[#79072f] hover:bg-[#5e0624] text-white"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Not Interested
            </Button>
          </div>
        )}

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

      {showContactPopup && (
        <ContactPopup 
          type={interestStatus === 'interested' ? 'interested' : 'thinking'}
          onClose={handlePopupClose}
        />
      )}

      {showNotInterestedPopup && (
        <NotInterestedPopup 
          onClose={handlePopupClose}
        />
      )}
    </>
  )
}

