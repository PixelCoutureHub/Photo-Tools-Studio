"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Target, Zap, Sparkles, TrendingDown, FileDown } from "lucide-react"

const targetSizes = [
  { label: "100 KB", value: 100, color: "from-red-500 to-red-600", description: "Ultra compressed" },
  { label: "200 KB", value: 200, color: "from-orange-500 to-orange-600", description: "High compression" },
  { label: "500 KB", value: 500, color: "from-yellow-500 to-yellow-600", description: "Balanced" },
  { label: "1 MB", value: 1024, color: "from-green-500 to-green-600", description: "Good quality" },
  { label: "2 MB", value: 2048, color: "from-blue-500 to-blue-600", description: "High quality" },
]

export default function KBReducerPage() {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null)
  const [selectedTarget, setSelectedTarget] = useState(200)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
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

  const reduceToTarget = async () => {
    if (!image) return

    setIsProcessing(true)
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

          const targetBytes = selectedTarget * 1024
          let currentQuality = 90
          let attempts = 0
          const maxAttempts = 12

          const tryCompress = () => {
            setProgress((attempts / maxAttempts) * 100)

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  attempts++

                  if (blob.size <= targetBytes || currentQuality <= 5 || attempts >= maxAttempts) {
                    const url = URL.createObjectURL(blob)
                    setCompressedImage(url)
                    setCompressedSize(blob.size)
                    setProgress(100)
                    setIsProcessing(false)
                    resolve()
                  } else {
                    currentQuality -= 7
                    setTimeout(tryCompress, 150)
                  }
                }
              },
              "image/jpeg",
              currentQuality / 100,
            )
          }

          tryCompress()
        }
        img.src = image.dataUrl
      })
    } catch (error) {
      console.error("Compression failed:", error)
      setIsProcessing(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressedImage) return

    const a = document.createElement("a")
    a.href = compressedImage
    a.download = `reduced-${selectedTarget}kb-${Date.now()}.jpg`
    a.click()
  }

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0
  const targetMet = compressedSize > 0 && compressedSize <= selectedTarget * 1024
  const selectedTargetData = targetSizes.find((t) => t.value === selectedTarget)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 dark:from-black dark:via-gray-900 dark:to-orange-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <FileDown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            KB Reducer
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Reduce image file size to specific target sizes automatically
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-orange-500" />
                  Upload Image
                </CardTitle>
              </CardHeader>
              <CardContent>{/* Placeholder for UploadImage component */}</CardContent>
            </Card>

            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Target className="mr-2 h-5 w-5 text-red-500" />
                  Target File Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {targetSizes.map((target) => (
                    <Button
                      key={target.value}
                      variant={selectedTarget === target.value ? "default" : "outline"}
                      onClick={() => setSelectedTarget(target.value)}
                      className={`h-20 flex flex-col items-center justify-center glass dark:glass-dark border-0 ${
                        selectedTarget === target.value ? `bg-gradient-to-r ${target.color} text-white shadow-lg` : ""
                      }`}
                    >
                      <span className="font-bold text-lg">{target.label}</span>
                      <span className="text-xs opacity-80">{target.description}</span>
                    </Button>
                  ))}
                </div>

                {selectedTargetData && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Selected Target:</span>
                      <Badge className={`bg-gradient-to-r ${selectedTargetData.color} text-white border-0`}>
                        {selectedTargetData.label} - {selectedTargetData.description}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {originalSize > 0 && (
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <TrendingDown className="mr-2 h-5 w-5 text-green-500" />
                    File Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                      <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        {formatFileSize(originalSize)}
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <div className="text-sm text-muted-foreground mb-1">Target Size</div>
                      <div className="text-xl font-bold text-orange-800 dark:text-orange-200">{selectedTarget} KB</div>
                    </div>
                  </div>

                  {compressedSize > 0 && (
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Final Size:</span>
                          <Badge variant={targetMet ? "default" : "destructive"}>
                            {formatFileSize(compressedSize)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Size Reduction:</span>
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                            {compressionRatio.toFixed(1)}% smaller
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Target Achievement:</span>
                          <Badge variant={targetMet ? "default" : "secondary"}>
                            {targetMet ? "✓ Target Met" : "✓ Best Possible"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button
                onClick={reduceToTarget}
                disabled={!image || isProcessing}
                className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg border-0 rounded-xl sm:rounded-2xl"
                size="lg"
              >
                <Zap className="mr-3 h-5 w-5" />
                {isProcessing ? "Processing..." : `Reduce to ${selectedTarget} KB`}
              </Button>

              {compressedImage && (
                <Button
                  onClick={downloadCompressed}
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg glass dark:glass-dark border-0 rounded-xl sm:rounded-2xl"
                  size="lg"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Download Reduced Image
                </Button>
              )}
            </div>

            {isProcessing && (
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Optimizing compression...</span>
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
                  <Target className="mr-2 h-5 w-5 text-orange-500" />
                  Before & After Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {image ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          Original
                        </h4>
                        <Badge variant="secondary">{formatFileSize(originalSize)}</Badge>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <img
                          src={image.dataUrl || "/placeholder.svg"}
                          alt="Original"
                          className="max-w-full h-auto border rounded-lg shadow-sm"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    </div>

                    {compressedImage ? (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Reduced
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={targetMet ? "default" : "secondary"}>
                              {formatFileSize(compressedSize)}
                            </Badge>
                            {targetMet && (
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                                Target Met!
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <img
                            src={compressedImage || "/placeholder.svg"}
                            alt="Compressed"
                            className="max-w-full h-auto border rounded-lg shadow-sm"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {compressionRatio.toFixed(1)}% size reduction achieved
                        </p>
                      </div>
                    ) : !isProcessing ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click "Reduce to {selectedTarget} KB" to process</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to start reducing file size</p>
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
