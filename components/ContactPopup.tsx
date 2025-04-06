'use client';


import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactPopupProps {
  onClose: () => void;
  type: 'interested' | 'thinking';
}

export function ContactPopup({ onClose, type }: ContactPopupProps) {
  const handleEmailClick = () => {
    window.location.href = "mailto:defaultemail@gmail.com";
  };

  const getTitle = () => {
    return type === 'interested' 
      ? "We're Excited to Work With You!"
      : "We'd Love to Hear Back From You!";
  };

  const getMessage = () => {
    return type === 'interested'
      ? "We're thrilled that you're interested in your renovation project! Please contact us using one of the methods below to get started."
      : "We understand you're still considering your options. We'd love to hear from you when you're ready to move forward with your renovation project. Feel free to reach out anytime!";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-2xl font-bold mb-4 text-[#79072f]">{getTitle()}</h2>
        
        <p className="text-gray-600 mb-6">
          {getMessage()}
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Phone:</span>
            <span className="text-gray-600">123-456-7890</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <Button
              variant="link"
              className="text-[#79072f] p-0 h-auto"
              onClick={handleEmailClick}
            >
              defaultemail@gmail.com
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 