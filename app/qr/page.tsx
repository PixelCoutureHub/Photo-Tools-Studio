"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, QrCode, Palette, Sparkles } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

const qrTypes = [
  { value: "text", label: "Plain Text", icon: "📝" },
  { value: "url", label: "Website URL", icon: "🌐" },
  { value: "email", label: "Email Address", icon: "📧" },
  { value: "phone", label: "Phone Number", icon: "📞" },
  { value: "sms", label: "SMS Message", icon: "💬" },
  { value: "wifi", label: "WiFi Network", icon: "📶" },
]

const errorLevels = [
  { value: "L", label: "Low (~7%)", description: "Smallest size" },
  { value: "M", label: "Medium (~15%)", description: "Balanced" },
  { value: "Q", label: "Quartile (~25%)", description: "Good recovery" },
  { value: "H", label: "High (~30%)", description: "Best recovery" },
]

const colorPresets = [
  { name: "Classic", fg: "#000000", bg: "#FFFFFF" },
  { name: "Blue", fg: "#1e40af", bg: "#dbeafe" },
  { name: "Green", fg: "#166534", bg: "#dcfce7" },
  { name: "Purple", fg: "#7c3aed", bg: "#f3e8ff" },
  { name: "Red", fg: "#dc2626", bg: "#fee2e2" },
]

export default function QRPage() {
  const [qrType, setQrType] = useState("text")
  const [content, setContent] = useState("")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [errorLevel, setErrorLevel] = useState("M")
  const [includeMargin, setIncludeMargin] = useState(true)

  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiSecurity, setWifiSecurity] = useState("WPA")
  const [wifiHidden, setWifiHidden] = useState(false)

  // SMS specific fields
  const [smsPhone, setSmsPhone] = useState("")
  const [smsMessage, setSmsMessage] = useState("")

  const generateQRContent = () => {
    switch (qrType) {
      case "text":
        return content
      case "url":
        return content.startsWith("http") ? content : `https://${content}`
      case "email":
        return `mailto:${content}`
      case "phone":
        return `tel:${content}`
      case "sms":
        return `sms:${smsPhone}?body=${encodeURIComponent(smsMessage)}`
      case "wifi":
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`
      default:
        return content
    }
  }

  const downloadQR = (format: "png" | "svg") => {
    const qrElement = document.getElementById("qr-code")
    if (!qrElement) return

    if (format === "svg") {
      const svgElement = qrElement.querySelector("svg")
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `qrcode-${Date.now()}.svg`
        a.click()
        URL.revokeObjectURL(url)
      }
    } else {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = size
      canvas.height = size

      const svgElement = qrElement.querySelector("svg")
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `qrcode-${Date.now()}.png`
              a.click()
              URL.revokeObjectURL(url)
            }
          })
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
      }
    }
  }

  const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
    setFgColor(preset.fg)
    setBgColor(preset.bg)
  }

  const qrContent = generateQRContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-100 dark:from-black dark:via-gray-900 dark:to-pink-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 via-rose-600 to-red-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate customizable QR codes for text, URLs, and more
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Controls */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-pink-500" />
                  Content Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="qr-type" className="text-sm font-medium">
                    QR Code Type
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {qrTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={qrType === type.value ? "default" : "outline"}
                        onClick={() => setQrType(type.value)}
                        className="h-auto p-3 flex flex-col items-center space-y-1 glass dark:glass-dark border-0"
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-xs font-medium">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {qrType === "wifi" ? (
                  <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wifi-ssid" className="text-sm font-medium">
                          Network Name (SSID)
                        </Label>
                        <Input
                          id="wifi-ssid"
                          value={wifiSSID}
                          onChange={(e) => setWifiSSID(e.target.value)}
                          placeholder="My WiFi Network"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-security" className="text-sm font-medium">
                          Security Type
                        </Label>
                        <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="wifi-password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="WiFi password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : qrType === "sms" ? (
                  <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div>
                      <Label htmlFor="sms-phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="sms-phone"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="+1234567890"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sms-message" className="text-sm font-medium">
                        Message
                      </Label>
                      <Textarea
                        id="sms-message"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Your message here..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium">
                      {qrType === "text" && "Text Content"}
                      {qrType === "url" && "Website URL"}
                      {qrType === "email" && "Email Address"}
                      {qrType === "phone" && "Phone Number"}
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        qrType === "text"
                          ? "Enter your text here..."
                          : qrType === "url"
                            ? "https://example.com"
                            : qrType === "email"
                              ? "user@example.com"
                              : qrType === "phone"
                                ? "+1234567890"
                                : ""
                      }
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl glass dark:glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Palette className="mr-2 h-5 w-5 text-purple-500" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="size" className="text-sm font-medium">
                    Size: {size}px
                  </Label>
                  <Input
                    id="size"
                    type="range"
                    min={128}
                    max={512}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>128px</span>
                    <span>512px</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        onClick={() => applyColorPreset(preset)}
                        className="h-12 p-1 glass dark:glass-dark border-0"
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div
                          className="w-full h-full rounded flex items-center justify-center"
                          style={{ backgroundColor: preset.fg }}
                        >
                          <QrCode className="h-4 w-4" style={{ color: preset.bg }} />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fg-color" className="text-sm font-medium">
                      Foreground Color
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="fg-color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bg-color" className="text-sm font-medium">
                      Background Color
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="error-level" className="text-sm font-medium">
                    Error Correction Level
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {errorLevels.map((level) => (
                      <Button
                        key={level.value}
                        variant={errorLevel === level.value ? "default" : "outline"}
                        onClick={() => setErrorLevel(level.value)}
                        className="h-auto p-3 flex flex-col items-center space-y-1 glass dark:glass-dark border-0"
                      >
                        <span className="font-bold">{level.value}</span>
                        <span className="text-xs">{level.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => downloadQR("png")}
                disabled={!qrContent}
                className="h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg border-0 rounded-xl sm:rounded-2xl"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button
                onClick={() => downloadQR("svg")}
                disabled={!qrContent}
                variant="outline"
                className="h-12 sm:h-14 text-base sm:text-lg glass dark:glass-dark border-0 rounded-xl sm:rounded-2xl"
              >
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-xl glass dark:glass-dark sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <QrCode className="mr-2 h-5 w-5 text-pink-500" />
                  QR Code Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {qrContent ? (
                  <div className="space-y-6">
                    <div className="flex justify-center p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div id="qr-code">
                        <QRCodeSVG
                          value={qrContent}
                          size={Math.min(size, 280)}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          level={errorLevel as "L" | "M" | "Q" | "H"}
                          includeMargin={includeMargin}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl border border-pink-200 dark:border-pink-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">{qrTypes.find((t) => t.value === qrType)?.label}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">
                          {size}×{size} pixels
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Error Correction:</span>
                        <span className="font-medium">{errorLevels.find((l) => l.value === errorLevel)?.label}</span>
                      </div>
                      <div className="pt-2 border-t border-pink-200 dark:border-pink-800">
                        <div className="text-sm font-medium mb-2">Content Preview:</div>
                        <div className="text-xs text-muted-foreground p-2 bg-white dark:bg-gray-800 rounded border break-all max-h-20 overflow-y-auto">
                          {qrContent}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter content to generate QR code</p>
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
