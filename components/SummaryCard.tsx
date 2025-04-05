'use client';

import { useState } from 'react';

interface SummaryCardProps {
  projectDetails: string;
  estimatedCost: string;
  estimatedDuration: string;
  conversationId: string;
  chatHistory: any[];
}

export default function SummaryCard({
  projectDetails,
  estimatedCost,
  estimatedDuration,
  conversationId,
  chatHistory,
}: SummaryCardProps) {
  const [interestStatus, setInterestStatus] = useState<'interested' | 'waiting' | 'not_interested' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestClick = async (status: 'interested' | 'waiting' | 'not_interested') => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          interestLevel: status,
          timestamp: new Date().toISOString(),
          chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit interest level');
      }

      setInterestStatus(status);
    } catch (error) {
      console.error('Error submitting interest level:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Project Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Details</h3>
          <p className="text-gray-600">{projectDetails}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Estimated Cost</h3>
          <p className="text-gray-600">{estimatedCost}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Estimated Duration</h3>
          <p className="text-gray-600">{estimatedDuration}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Are you interested in this project?</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleInterestClick('interested')}
            disabled={isSubmitting || interestStatus !== null}
            className={`px-6 py-3 rounded-lg transition-colors ${
              interestStatus === 'interested'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            } ${isSubmitting || interestStatus !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Interested
          </button>
          
          <button
            onClick={() => handleInterestClick('waiting')}
            disabled={isSubmitting || interestStatus !== null}
            className={`px-6 py-3 rounded-lg transition-colors ${
              interestStatus === 'waiting'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            } ${isSubmitting || interestStatus !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Waiting
          </button>
          
          <button
            onClick={() => handleInterestClick('not_interested')}
            disabled={isSubmitting || interestStatus !== null}
            className={`px-6 py-3 rounded-lg transition-colors ${
              interestStatus === 'not_interested'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            } ${isSubmitting || interestStatus !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Not Interested
          </button>
        </div>
      </div>
    </div>
  );
} 