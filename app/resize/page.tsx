"use client"
import { useState } from "react"
import { UploadImage } from "@/components/upload-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, ImageIcon, Lock, Unlock, Sparkles, Zap, Settings } from "lucide-react"

const presetSizes = [
  { label: "Instagram Square", width: 1080, height: 1080, category: "social" },
  { label: "Instagram Story", width: 1080, height: 1920, category: "social" },
  { label: "Facebook Cover", width: 1200, height: 630, category: "social" },
  { label: "Twitter Header", width: 1500, height: 500, category: "social" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, category: "social" },
  { label: "LinkedIn Banner", width: 1584, height: 396, category: "social" },
  { label: "HD (1920×1080)", width: 1920, height: 1080, category: "standard" },
  { label: "4K (3840×2160)", width: 3840, height: 2160, category: "standard" },
  { label: "A4 Print (2480×3508)", width: 2480, height: 3508, category: "print" },
]

export default function ResizePage() {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState(90)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImage({ file, dataUrl })

    // Get original dimensions
    const img = new Image()
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height })
      setWidth(img.width)
      setHeight(img.height)
    }
    img.src = dataUrl
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const applyPreset = (preset: (typeof presetSizes)[0]) => {
    setWidth(preset.width)
    setHeight(preset.height)
    setMaintainAspectRatio(false)
  }

  const resizeImage = async () => {
    if (!image) return

    setIsProcessing(true)

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      canvas.width = width
      canvas.height = height

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height)

          const mimeType = format === "jpg" ? "image/jpeg" : "image/png"
          const qualityValue = format === "jpg" ? quality / 100 : 1

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `resized-${width}x${height}.${format}`
                a.click()
                URL.revokeObjectURL(url)
              }
              resolve()
            },
            mimeType,
            qualityValue,
          )
        }
        img.src = image.dataUrl
      })
    } catch (error) {
      console.error("Resize failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-black dark:via-gray-900 dark:to-emerald-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Image Resizer
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Resize images to custom dimensions while maintaining quality
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-emerald-500" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadImage onImageUpload={handleImageUpload} />
              </CardContent>
            </Card>

            {originalDimensions && (
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <ImageIcon className="mr-2 h-5 w-5 text-blue-500" />
                    Original Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium">Size:</span>
                    <Badge variant="secondary" className="text-blue-800 dark:text-blue-200">
                      {originalDimensions.width} × {originalDimensions.height} pixels
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Settings className="mr-2 h-5 w-5 text-purple-500" />
                  Resize Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-sm font-medium">
                      Width (px)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height (px)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <Switch id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
                  <Label htmlFor="aspect-ratio" className="flex items-center text-sm font-medium">
                    {maintainAspectRatio ? (
                      <Lock className="mr-2 h-4 w-4 text-green-600" />
                    ) : (
                      <Unlock className="mr-2 h-4 w-4 text-orange-600" />
                    )}
                    Maintain aspect ratio
                  </Label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="format" className="text-sm font-medium">
                      Output Format
                    </Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Lossless)</SelectItem>
                        <SelectItem value="jpg">JPEG (Smaller file)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {format === "jpg" && (
                    <div>
                      <Label htmlFor="quality" className="text-sm font-medium">
                        Quality: {quality}%
                      </Label>
                      <Input
                        id="quality"
                        type="range"
                        min={10}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Quick Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Social Media</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {presetSizes
                        .filter((p) => p.category === "social")
                        .map((preset) => (
                          <Button
                            key={preset.label}
                            variant="outline"
                            onClick={() => applyPreset(preset)}
                            className="justify-between h-auto p-3 glass dark:glass-dark border-0"
                          >
                            <span className="font-medium text-xs sm:text-sm">{preset.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {preset.width}×{preset.height}
                            </span>
                          </Button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Standard & Print</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {presetSizes
                        .filter((p) => p.category !== "social")
                        .map((preset) => (
                          <Button
                            key={preset.label}
                            variant="outline"
                            onClick={() => applyPreset(preset)}
                            className="justify-between h-auto p-3 glass dark:glass-dark border-0"
                          >
                            <span className="font-medium text-xs sm:text-sm">{preset.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {preset.width}×{preset.height}
                            </span>
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={resizeImage}
              disabled={!image || isProcessing}
              className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg border-0 rounded-xl sm:rounded-2xl"
              size="lg"
            >
              <Download className="mr-3 h-5 w-5" />
              {isProcessing ? "Processing..." : "Download Resized Image"}
            </Button>
          </div>

          {/* Preview */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-xl glass dark:glass-dark sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <ImageIcon className="mr-2 h-5 w-5 text-green-500" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {image ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <img
                        src={image.dataUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-auto border rounded-lg shadow-sm"
                        style={{
                          width: Math.min(width, 300),
                          height: Math.min(height, 200),
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">New Size:</span>
                        <span className="font-medium">
                          {width} × {height} pixels
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">{format.toUpperCase()}</span>
                      </div>
                      {format === "jpg" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="font-medium">{quality}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
