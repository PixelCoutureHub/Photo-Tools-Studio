"use client"

import { useEffect, useState } from "react"
import { Camera, Sparkles, Zap, ImageIcon } from "lucide-react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Camera, label: "Initializing PhotoTools Studio", color: "from-blue-500 to-blue-600" },
    { icon: ImageIcon, label: "Loading Image Processing Engine", color: "from-purple-500 to-purple-600" },
    { icon: Zap, label: "Optimizing Performance", color: "from-green-500 to-green-600" },
    { icon: Sparkles, label: "Ready to Create Magic", color: "from-pink-500 to-pink-600" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }

        const newProgress = prev + Math.random() * 15 + 5
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        return Math.min(newProgress, 100)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-black dark:via-gray-900 dark:to-blue-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
            <Camera className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          PhotoTools Studio
        </h1>
        <p className="text-muted-foreground mb-8">Professional Image Processing</p>

        {/* Current Step */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${currentStepData.color} rounded-full text-white shadow-lg`}
          >
            <currentStepData.icon className="h-5 w-5 animate-pulse" />
            <span className="font-medium">{currentStepData.label}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{Math.round(progress)}%</div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Professional Quality</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </div>
    </div>
  )
}
