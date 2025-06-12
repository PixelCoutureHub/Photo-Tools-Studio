"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Crop, Check, X, RotateCw, ZoomIn, ZoomOut, Square } from "lucide-react"

interface CropImageProps {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
  aspectRatio?: number
}

interface CroppedAreaPixels {
  x: number
  y: number
  width: number
  height: number
}

export function CropImage({ image, onCropComplete, onCancel, aspectRatio }: CropImageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || isProcessing) return

    setIsProcessing(true)

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      const imageElement = new Image()
      imageElement.crossOrigin = "anonymous"

      await new Promise<void>((resolve, reject) => {
        imageElement.onload = () => {
          const { width, height, x, y } = croppedAreaPixels

          // Set canvas size to cropped area
          canvas.width = width
          canvas.height = height

          // Clear canvas
          ctx.clearRect(0, 0, width, height)

          // Save context state
          ctx.save()

          // Apply rotation if needed
          if (rotation !== 0) {
            // Move to center of canvas
            ctx.translate(width / 2, height / 2)
            // Rotate
            ctx.rotate((rotation * Math.PI) / 180)
            // Move back
            ctx.translate(-width / 2, -height / 2)
          }

          // Draw the cropped portion of the image
          ctx.drawImage(
            imageElement,
            x,
            y,
            width,
            height, // Source rectangle
            0,
            0,
            width,
            height, // Destination rectangle
          )

          // Restore context state
          ctx.restore()

          resolve()
        }

        imageElement.onerror = () => {
          reject(new Error("Failed to load image"))
        }

        imageElement.src = image
      })

      // Convert canvas to blob and create URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            onCropComplete(url)
          }
          setIsProcessing(false)
        },
        "image/jpeg",
        0.95,
      )
    } catch (error) {
      console.error("Error creating cropped image:", error)
      setIsProcessing(false)
    }
  }, [croppedAreaPixels, rotation, onCropComplete, image, isProcessing])

  const resetCrop = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  const quickRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <Card className="w-full border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Crop className="mr-2 h-5 w-5 text-blue-500" />
            Crop & Adjust Image
          </div>
          {aspectRatio && (
            <Badge variant="outline" className="flex items-center">
              <Square className="mr-1 h-3 w-3" />
              {aspectRatio === 1 ? "Square" : `${aspectRatio.toFixed(2)}:1`}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cropper Container */}
        <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteHandler}
            showGrid={true}
            style={{
              containerStyle: {
                background: "transparent",
                borderRadius: "12px",
              },
              cropAreaStyle: {
                border: "2px solid #3b82f6",
                borderRadius: "4px",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              },
              mediaStyle: {
                borderRadius: "12px",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zoom Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom" className="flex items-center text-sm font-medium">
                <ZoomIn className="mr-2 h-4 w-4" />
                Zoom: {zoom.toFixed(1)}x
              </Label>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Slider
              id="zoom"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="rotation" className="flex items-center text-sm font-medium">
                <RotateCw className="mr-2 h-4 w-4" />
                Rotation: {rotation}°
              </Label>
              <Button size="sm" variant="outline" onClick={quickRotate}>
                <RotateCw className="h-3 w-3 mr-1" />
                90°
              </Button>
            </div>
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={createCroppedImage}
            disabled={!croppedAreaPixels || isProcessing}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Check className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Apply Crop"}
          </Button>
          <Button onClick={resetCrop} variant="outline" className="flex-1">
            Reset
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tips:</strong> Drag to move the crop area, use mouse wheel to zoom, or use the controls above for
            precise adjustments.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
