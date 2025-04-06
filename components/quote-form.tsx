"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadZone } from "@/components/upload-zone"
import { ChatWindow } from "@/components/chat-window"
import { HowItWorks } from "@/components/how-it-works"

interface ImageState {
  current: File[]
  desired: File[]
}

export function QuoteForm() {
  const [images, setImages] = useState<ImageState>({
    current: [],
    desired: []
  })
  const [description, setDescription] = useState("")
  const [timeline, setTimeline] = useState("")
  const [showChat, setShowChat] = useState(false)

  // Reset function to clear the form
  const resetForm = () => {
    setImages({
      current: [],
      desired: []
    })
    setDescription("")
    setTimeline("")
    setShowChat(false)
  }

  const handleStartChat = () => {
    if (description.trim()) {
      setShowChat(true)
    }
  }

  return (
    <div className="space-y-8">
      <HowItWorks />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        {!showChat ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current-upload" className="text-gray-700 font-medium">
                  Current State Images (optional)
                </Label>
                <UploadZone
                  images={images.current}
                  setImages={(files) => setImages({ ...images, current: files })}
                  title="Current State"
                  maxFiles={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desired-upload" className="text-gray-700 font-medium">
                  Desired State Images (optional)
                </Label>
                <UploadZone
                  images={images.desired}
                  setImages={(files) => setImages({ ...images, desired: files })}
                  title="Desired State"
                  maxFiles={5}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Describe what you want changed
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe your renovation vision in detail. For example: 'I want to transform my kitchen from its current outdated look to a modern, open-concept space. I'd like to remove the wall between the kitchen and living room, install new quartz countertops, add a kitchen island, and update the cabinets to a white shaker style. I'm also interested in new appliances and better lighting.'"
                className="min-h-[120px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-gray-700 font-medium">
                Desired timeline (optional)
              </Label>
              <Input
                id="timeline"
                placeholder="e.g., 2 weeks, 3 months"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              />
            </div>

            <Button
              onClick={handleStartChat}
              className="w-full bg-[#79072f] hover:bg-[#5e0624] text-white"
              disabled={!description.trim()}
            >
              Start Chat
            </Button>
          </div>
        ) : (
          <ChatWindow
            description={description}
            timeline={timeline}
            currentImages={images.current}
            desiredImages={images.desired}
            onClose={resetForm}
          />
        )}
      </div>
    </div>
  )
}

