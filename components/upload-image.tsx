"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadImageProps {
  onImageUpload: (file: File, dataUrl: string) => void
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
}

export function UploadImage({
  onImageUpload,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          setPreview(dataUrl)
          setFileName(file.name)
          onImageUpload(file, dataUrl)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  const clearImage = () => {
    setPreview(null)
    setFileName("")
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        {!preview ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{isDragActive ? "Drop your image here" : "Upload an image"}</p>
            <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to select</p>
            <Button variant="outline">Choose File</Button>
            {fileRejections.length > 0 && (
              <p className="text-sm text-destructive mt-2">File too large or invalid format</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-contain rounded-lg border"
              />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{fileName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
