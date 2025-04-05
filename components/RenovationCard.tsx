'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import ChatInterface from './ChatInterface';
import HowItWorks from './HowItWorks';

interface ImageState {
  current: FileWithPath[];
  desired: FileWithPath[];
}

export default function RenovationCard() {
  const [images, setImages] = useState<ImageState>({
    current: [],
    desired: [],
  });
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[], section: 'current' | 'desired') => {
    setImages(prev => {
      const newImages = [...prev[section], ...acceptedFiles].slice(0, 5);
      return {
        ...prev,
        [section]: newImages,
      };
    });
  }, []);

  const { getRootProps: getCurrentRootProps, getInputProps: getCurrentInputProps } = useDropzone({
    onDrop: (files: FileWithPath[]) => onDrop(files, 'current'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
  });

  const { getRootProps: getDesiredRootProps, getInputProps: getDesiredInputProps } = useDropzone({
    onDrop: (files: FileWithPath[]) => onDrop(files, 'desired'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
  });

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Upload images
      const formData = new FormData();
      [...images.current, ...images.desired].forEach(file => {
        formData.append('images', file);
      });

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }

      const { images: uploadedImages } = await uploadResponse.json();

      // Split uploaded images back into current and desired
      const currentUploaded = uploadedImages.slice(0, images.current.length);
      const desiredUploaded = uploadedImages.slice(images.current.length);

      // Now send the description and image data to the estimate endpoint
      const estimateResponse = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          currentImages: currentUploaded,
          desiredImages: desiredUploaded,
        }),
      });

      if (!estimateResponse.ok) {
        throw new Error('Failed to get estimate');
      }

      const data = await estimateResponse.json();
      console.log('Estimate received:', data);

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <HowItWorks />
      
      <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-6 border border-[#3a3a3a]">
        <h2 className="text-2xl font-bold mb-6 text-white">Upload Your Images</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Current State Section */}
          <div className="border-2 border-dashed border-[#4a4a4a] rounded-lg p-4 min-h-[400px] bg-[#1f1f1f]">
            <div {...getCurrentRootProps()} className="h-full flex flex-col">
              <input {...getCurrentInputProps()} />
              <h3 className="text-lg font-semibold mb-4 text-white">Current State</h3>
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Drag and drop images here, or click to select files</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.current.map((file, index) => (
                  <div key={index} className="relative h-32">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Current state image ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desired State Section */}
          <div className="border-2 border-dashed border-[#4a4a4a] rounded-lg p-4 min-h-[400px] bg-[#1f1f1f]">
            <div {...getDesiredRootProps()} className="h-full flex flex-col">
              <input {...getDesiredInputProps()} />
              <h3 className="text-lg font-semibold mb-4 text-white">Desired State</h3>
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Drag and drop images here, or click to select files</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.desired.map((file, index) => (
                  <div key={index} className="relative h-32">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Desired state image ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Describe Your Renovation</h3>
          <textarea
            className="w-full p-4 border border-[#4a4a4a] rounded-lg min-h-[150px] bg-[#1f1f1f] text-white placeholder-gray-400"
            placeholder="Describe the renovations you want..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg transition-colors ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#8B0000] hover:bg-[#A00000] text-white'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Get Estimate'}
        </button>
      </div>

      <ChatInterface />
    </div>
  );
} 