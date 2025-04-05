"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Image } from "lucide-react"

interface UploadZoneProps {
  images: File[]
  setImages: (files: File[]) => void
  title: string
  maxFiles?: number
}

export function UploadZone({ images, setImages, title, maxFiles = 5 }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, maxFiles)
      setImages(newFiles)
    },
    [images, setImages, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: maxFiles - images.length
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-[#79072f] bg-[#fff5f7]' : 'border-gray-300 hover:border-[#79072f]'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <Image className="mx-auto h-12 w-12 text-gray-400" />
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop images here, or click to select files</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {images.length} of {maxFiles} images uploaded
          </p>
        </div>
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setImages(images.filter((_, i) => i !== index))
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

