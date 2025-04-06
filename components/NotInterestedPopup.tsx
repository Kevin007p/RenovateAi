'use client';


import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NotInterestedPopupProps {
  onClose: () => void;
}

export function NotInterestedPopup({ onClose }: NotInterestedPopupProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalComments, setAdditionalComments] = useState("");

  const reasons = [
    "Price is too high",
    "Timeline doesn't work for me",
    "Not the right style/design",
    "Location doesn't work",
    "Not ready to start yet",
    "Found another contractor",
    "Other"
  ];

  const handleReasonChange = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    // Here you would typically send this feedback to your backend
    console.log({
      reasons: selectedReasons,
      additionalComments
    });
    onClose();
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
        
        <h2 className="text-2xl font-bold mb-4 text-[#79072f]">We're Sorry to See You Go</h2>
        
        <p className="text-gray-600 mb-6">
          We're sorry we couldn't meet your needs. Your feedback would help us improve our service.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">What were the main reasons? (Select all that apply)</h3>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label key={reason} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonChange(reason)}
                    className="rounded border-gray-300 text-[#79072f] focus:ring-[#79072f]"
                  />
                  <span className="text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Additional Comments (Optional)</h3>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              className="w-full p-2 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#79072f]"
              placeholder="Please share any additional feedback..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-[#79072f] hover:bg-[#5e0624] text-white"
          >
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
} 