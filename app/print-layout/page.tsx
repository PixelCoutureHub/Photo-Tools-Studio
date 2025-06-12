"use client"
import { useState } from "react"
import { UploadImage } from "@/components/upload-image"
import { CropImage } from "@/components/crop-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Crop, FileText, Sparkles } from "lucide-react"
import { jsPDF } from "jspdf"

const paperSizes = [
  { value: "a4", label: "A4 (210 × 297 mm)", width: 210, height: 297 },
  { value: "a3", label: "A3 (297 × 420 mm)", width: 297, height: 420 },
  { value: "4x6", label: "4×6 inch (102 × 152 mm)", width: 102, height: 152 },
  { value: "letter", label: "Letter (216 × 279 mm)", width: 216, height: 279 },
]

const photoSizes = [
  // Passport & ID Sizes
  { value: "51x51", label: "51×51 mm (Passport)", width: 51, height: 51, category: "passport" },
  { value: "35x45", label: "35×45 mm (Passport)", width: 35, height: 45, category: "passport" },
  { value: "33x48", label: "33×48 mm (Passport)", width: 33, height: 48, category: "passport" },
  { value: "25x32", label: "25×32 mm (ID Card)", width: 25, height: 32, category: "passport" },

  // Stamp Sizes
  { value: "20x25", label: "20×25 mm (Small Stamp)", width: 20, height: 25, category: "stamp" },
  { value: "25x30", label: "25×30 mm (Medium Stamp)", width: 25, height: 30, category: "stamp" },
  { value: "30x40", label: "30×40 mm (Large Stamp)", width: 30, height: 40, category: "stamp" },
  { value: "40x50", label: "40×50 mm (XL Stamp)", width: 40, height: 50, category: "stamp" },

  // Standard Photo Sizes
  { value: "50x75", label: "50×75 mm (2×3 inch)", width: 50, height: 75, category: "standard" },
  { value: "89x127", label: "89×127 mm (3.5×5 inch)", width: 89, height: 127, category: "standard" },
  { value: "102x152", label: "102×152 mm (4×6 inch)", width: 102, height: 152, category: "standard" },

  { value: "custom", label: "Custom Size", width: 0, height: 0, category: "custom" },
]

export default function PrintLayoutPage() {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [paperSize, setPaperSize] = useState("a4")
  const [photoSize, setPhotoSize] = useState("51x51")
  const [customWidth, setCustomWidth] = useState(20)
  const [customHeight, setCustomHeight] = useState(25)
  const [copies, setCopies] = useState(6)
  const [margin, setMargin] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImage({ file, dataUrl })
    setCroppedImage(null)
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl)
  }

  const selectedPaper = paperSizes.find((p) => p.value === paperSize)!
  const selectedPhoto = photoSizes.find((p) => p.value === photoSize)!

  const photoWidth = photoSize === "custom" ? customWidth : selectedPhoto.width
  const photoHeight = photoSize === "custom" ? customHeight : selectedPhoto.height

  // Calculate layout
  const availableWidth = selectedPaper.width - margin * 2
  const availableHeight = selectedPaper.height - margin * 2
  const photosPerRow = Math.floor(availableWidth / photoWidth)
  const photosPerColumn = Math.floor(availableHeight / photoHeight)
  const maxPhotos = photosPerRow * photosPerColumn

  const generateHighQualityPDF = async () => {
    if (!image) return

    setIsGenerating(true)

    try {
      const imageToUse = croppedImage || image.dataUrl

      // Create PDF with high quality settings
      const pdf = new jsPDF({
        orientation: selectedPaper.width > selectedPaper.height ? "landscape" : "portrait",
        unit: "mm",
        format: [selectedPaper.width, selectedPaper.height],
        compress: false, // Disable compression for best quality
      })

      // Load and process image
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const photoWidthMm = photoWidth
          const photoHeightMm = photoHeight

          let drawn = 0
          for (let row = 0; row < photosPerColumn && drawn < copies; row++) {
            for (let col = 0; col < photosPerRow && drawn < copies; col++) {
              const x = margin + col * photoWidthMm
              const y = margin + row * photoHeightMm

              // Add image to PDF with high quality
              pdf.addImage(
                imageToUse,
                "JPEG",
                x,
                y,
                photoWidthMm,
                photoHeightMm,
                undefined,
                "FAST", // Use FAST compression for better quality
              )
              drawn++
            }
          }

          // Save PDF with descriptive filename
          pdf.save(`print-layout-${paperSize}-${photoWidth}x${photoHeight}mm-${copies}copies-HQ.pdf`)
          resolve()
        }
        img.src = imageToUse
      })
    } catch (error) {
      console.error("PDF generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const displayImage = croppedImage || image?.dataUrl

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Printer className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Print Layout Maker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional print layouts with multiple copies of your photos in high-quality PDF format
          </p>
        </div>

        {showCropper && image ? (
          <div className="max-w-4xl mx-auto">
            <CropImage
              image={image.dataUrl}
              onCropComplete={handleCropComplete}
              onCancel={() => setShowCropper(false)}
              aspectRatio={photoWidth / photoHeight}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                    Image Upload & Editing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <UploadImage onImageUpload={handleImageUpload} />

                  {image && (
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setShowCropper(true)}
                        variant="outline"
                        className="flex-1 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Crop className="mr-2 h-4 w-4" />
                        Crop Image
                      </Button>
                      {croppedImage && (
                        <Button
                          onClick={() => setCroppedImage(null)}
                          variant="outline"
                          className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
                        >
                          Reset Crop
                        </Button>
                      )}
                    </div>
                  )}

                  {croppedImage && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          ✓ Image Cropped
                        </Badge>
                        <span className="ml-2 text-sm text-green-700 dark:text-green-300">
                          Using cropped version for layout
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 h-5 w-5 text-purple-500" />
                    Layout Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paper-size" className="text-sm font-medium">
                          Paper Size
                        </Label>
                        <Select value={paperSize} onValueChange={setPaperSize}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paperSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="photo-size" className="text-sm font-medium">
                          Photo Size
                        </Label>
                        <Select value={photoSize} onValueChange={setPhotoSize}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Passport & ID</div>
                            {photoSizes
                              .filter((size) => size.category === "passport")
                              .map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}

                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                              Stamp Sizes
                            </div>
                            {photoSizes
                              .filter((size) => size.category === "stamp")
                              .map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}

                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                              Standard Photos
                            </div>
                            {photoSizes
                              .filter((size) => size.category === "standard")
                              .map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}

                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                              Custom
                            </div>
                            {photoSizes
                              .filter((size) => size.category === "custom")
                              .map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {photoSize === "custom" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="custom-width" className="text-sm font-medium">
                              Width (mm)
                            </Label>
                            <Input
                              id="custom-width"
                              type="number"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(Number(e.target.value))}
                              min={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="custom-height" className="text-sm font-medium">
                              Height (mm)
                            </Label>
                            <Input
                              id="custom-height"
                              type="number"
                              value={customHeight}
                              onChange={(e) => setCustomHeight(Number(e.target.value))}
                              min={1}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="copies" className="text-sm font-medium">
                          Number of Copies
                        </Label>
                        <Input
                          id="copies"
                          type="number"
                          value={copies}
                          onChange={(e) => setCopies(Number(e.target.value))}
                          min={1}
                          max={maxPhotos}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum {maxPhotos} photos fit on this paper size
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="margin" className="text-sm font-medium">
                          Margin (mm)
                        </Label>
                        <Input
                          id="margin"
                          type="number"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          min={0}
                          max={50}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Layout Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Paper:</span>
                        <span className="ml-2 font-medium">{selectedPaper.label}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Photo Size:</span>
                        <span className="ml-2 font-medium">
                          {photoWidth}×{photoHeight} mm
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Grid:</span>
                        <span className="ml-2 font-medium">
                          {photosPerRow} × {photosPerColumn}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Copies:</span>
                        <span className="ml-2 font-medium">{Math.min(copies, maxPhotos)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                    Quick Presets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaperSize("a4")
                        setPhotoSize("51x51")
                        setCopies(6)
                        setMargin(10)
                      }}
                      className="h-16 flex flex-col items-center justify-center text-xs"
                    >
                      <div className="w-3 h-3 bg-blue-500 rounded mb-1" />
                      Passport Photos
                      <span className="text-xs text-muted-foreground">A4 • 51×51mm</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaperSize("a4")
                        setPhotoSize("20x25")
                        setCopies(20)
                        setMargin(5)
                      }}
                      className="h-16 flex flex-col items-center justify-center text-xs"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded mb-1" />
                      Small Stamps
                      <span className="text-xs text-muted-foreground">A4 • 20×25mm</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaperSize("4x6")
                        setPhotoSize("102x152")
                        setCopies(1)
                        setMargin(0)
                      }}
                      className="h-16 flex flex-col items-center justify-center text-xs"
                    >
                      <div className="w-3 h-3 bg-purple-500 rounded mb-1" />
                      Single Photo
                      <span className="text-xs text-muted-foreground">4×6 • Full Size</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaperSize("a4")
                        setPhotoSize("35x45")
                        setCopies(8)
                        setMargin(10)
                      }}
                      className="h-16 flex flex-col items-center justify-center text-xs"
                    >
                      <div className="w-3 h-3 bg-orange-500 rounded mb-1" />
                      ID Photos
                      <span className="text-xs text-muted-foreground">A4 • 35×45mm</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateHighQualityPDF}
                disabled={!image || isGenerating}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                size="lg"
              >
                <Download className="mr-3 h-5 w-5" />
                {isGenerating ? "Generating High-Quality PDF..." : "Generate Print-Ready PDF"}
              </Button>
            </div>

            {/* Preview */}
            <div className="xl:col-span-1">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Printer className="mr-2 h-5 w-5 text-green-500" />
                    Layout Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div
                      className="bg-white dark:bg-gray-700 shadow-lg mx-auto relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                      style={{
                        aspectRatio: `${selectedPaper.width} / ${selectedPaper.height}`,
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    >
                      {displayImage && (
                        <div
                          className="absolute inset-0 grid gap-1 p-2"
                          style={{
                            gridTemplateColumns: `repeat(${photosPerRow}, 1fr)`,
                            gridTemplateRows: `repeat(${photosPerColumn}, 1fr)`,
                          }}
                        >
                          {Array.from({ length: Math.min(copies, maxPhotos) }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 overflow-hidden rounded-sm shadow-sm"
                              style={{ aspectRatio: `${photoWidth} / ${photoHeight}` }}
                            >
                              <img
                                src={displayImage || "/placeholder.svg"}
                                alt={`Copy ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {!displayImage && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                          <div className="text-center">
                            <Printer className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Upload an image to see preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {displayImage && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Ready for Print</h4>
                      <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <p>✓ High-quality PDF output</p>
                        <p>✓ Print-ready resolution</p>
                        <p>✓ Professional layout</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
