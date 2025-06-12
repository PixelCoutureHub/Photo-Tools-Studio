"use client"

import { useState } from "react"
import { UploadImage } from "@/components/upload-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, FileImage, Zap, Settings, Sparkles, TrendingDown, Minimize2 } from "lucide-react"

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

export default function CompressPage() {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null)
  const [compressionMode, setCompressionMode] = useState<"quality" | "size">("quality")
  const [quality, setQuality] = useState(80)
  const [targetSize, setTargetSize] = useState(500) // KB
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImage({ file, dataUrl })
    setOriginalSize(file.size)
    setCompressedImage(null)
    setCompressedSize(0)
    setProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const compressImage = async () => {
    if (!image) return

    setIsCompressing(true)
    setProgress(0)

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          if (compressionMode === "quality") {
            setProgress(50)
            // Compress by quality
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob)
                  setCompressedImage(url)
                  setCompressedSize(blob.size)
                  setProgress(100)
                }
                setIsCompressing(false)
                resolve()
              },
              "image/jpeg",
              quality / 100,
            )
          } else {
            // Compress to target size
            let currentQuality = 90
            let attempts = 0
            const maxAttempts = 10

            const tryCompress = () => {
              setProgress((attempts / maxAttempts) * 100)

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    attempts++
                    const sizeKB = blob.size / 1024

                    if (sizeKB <= targetSize || currentQuality <= 10 || attempts >= maxAttempts) {
                      const url = URL.createObjectURL(blob)
                      setCompressedImage(url)
                      setCompressedSize(blob.size)
                      setProgress(100)
                      setIsCompressing(false)
                      resolve()
                    } else {
                      currentQuality -= 8
                      setTimeout(tryCompress, 100)
                    }
                  }
                },
                "image/jpeg",
                currentQuality / 100,
              )
            }
            tryCompress()
          }
        }
        img.src = image.dataUrl
      })
    } catch (error) {
      console.error("Compression failed:", error)
      setIsCompressing(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressedImage) return

    const a = document.createElement("a")
    a.href = compressedImage
    a.download = `compressed-${Date.now()}.jpg`
    a.click()
  }

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-black dark:via-gray-900 dark:to-purple-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <Minimize2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Image Compressor
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Compress images to reduce file size without losing quality
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadImage onImageUpload={handleImageUpload} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Settings className="mr-2 h-5 w-5 text-indigo-500" />
                  Compression Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="compression-mode" className="text-sm font-medium">
                    Compression Mode
                  </Label>
                  <Select
                    value={compressionMode}
                    onValueChange={(value: "quality" | "size") => setCompressionMode(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quality">By Quality</SelectItem>
                      <SelectItem value="size">By Target Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {compressionMode === "quality" ? (
                  <div className="space-y-3">
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
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lower quality</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="target-size" className="text-sm font-medium">
                      Target Size (KB)
                    </Label>
                    <Input
                      id="target-size"
                      type="number"
                      value={targetSize}
                      onChange={(e) => setTargetSize(Number(e.target.value))}
                      min={50}
                      max={5000}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The compressor will try to reach this file size
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {originalSize > 0 && (
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <TrendingDown className="mr-2 h-5 w-5 text-green-500" />
                    File Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                      <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                        {formatFileSize(originalSize)}
                      </div>
                    </div>

                    {compressedSize > 0 && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="text-sm text-muted-foreground mb-1">Compressed Size</div>
                        <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                          {formatFileSize(compressedSize)}
                        </div>
                      </div>
                    )}
                  </div>

                  {compressedSize > 0 && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Size Reduction:</span>
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                          {compressionRatio.toFixed(1)}% smaller
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button
                onClick={compressImage}
                disabled={!image || isCompressing}
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg border-0 rounded-xl sm:rounded-2xl"
                size="lg"
              >
                <Zap className="mr-3 h-5 w-5" />
                {isCompressing ? "Compressing..." : "Compress Image"}
              </Button>

              {compressedImage && (
                <Button
                  onClick={downloadCompressed}
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg glass dark:glass-dark border-0 rounded-xl sm:rounded-2xl"
                  size="lg"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Download Compressed Image
                </Button>
              )}
            </div>

            {isCompressing && (
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground text-center">
                      Finding the best quality for your target size
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-xl glass dark:glass-dark sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <FileImage className="mr-2 h-5 w-5 text-purple-500" />
                  Before & After
                </CardTitle>
              </CardHeader>
              <CardContent>
                {image ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        Original
                      </h4>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <img
                          src={image.dataUrl || "/placeholder.svg"}
                          alt="Original"
                          className="max-w-full h-auto border rounded-lg shadow-sm"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Size: {formatFileSize(originalSize)}</p>
                    </div>

                    {compressedImage && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Compressed
                        </h4>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <img
                            src={compressedImage || "/placeholder.svg"}
                            alt="Compressed"
                            className="max-w-full h-auto border rounded-lg shadow-sm"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Size: {formatFileSize(compressedSize)} ({compressionRatio.toFixed(1)}% smaller)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
