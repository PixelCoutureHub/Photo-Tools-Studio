import ToolCard from "@/components/tool-card"
import {
  ImageIcon,
  Minimize2,
  FileDown,
  QrCode,
  Printer,
  Sparkles,
  Shield,
  Zap,
  Star,
  Users,
  Award,
} from "lucide-react"

const tools = [
  {
    title: "Print Layout Maker",
    description: "Create professional print layouts with high-quality PDF export and image cropping",
    icon: Printer,
    href: "/print-layout",
    color: "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600",
    features: ["PDF Export", "Image Cropping", "Multiple Sizes"],
    popular: true,
  },
  {
    title: "Image Resizer",
    description: "Resize images to custom dimensions while maintaining quality",
    icon: ImageIcon,
    href: "/resize",
    color: "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600",
    features: ["Custom Sizes", "Aspect Ratio", "Presets"],
  },
  {
    title: "Image Compressor",
    description: "Compress images to reduce file size without losing quality",
    icon: Minimize2,
    href: "/compress",
    color: "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600",
    features: ["Quality Control", "Size Target", "Batch Process"],
  },
  {
    title: "KB Reducer",
    description: "Reduce image file size to specific target sizes automatically",
    icon: FileDown,
    href: "/kb-reducer",
    color: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
    features: ["Auto Optimize", "Target Sizes", "Smart Compression"],
  },
  {
    title: "QR Code Generator",
    description: "Generate customizable QR codes for text, URLs, and more",
    icon: QrCode,
    href: "/qr",
    color: "bg-gradient-to-br from-pink-500 via-rose-600 to-red-600",
    features: ["Multiple Types", "Customizable", "High Quality"],
  },
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process images instantly with optimized algorithms and modern web technologies",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens locally in your browser - no uploads to servers required",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Professional Quality",
    description: "Export high-quality PDFs and images suitable for professional printing",
    color: "from-purple-400 to-pink-500",
  },
]

const stats = [
  { icon: Users, value: "50K+", label: "Happy Users" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Award, value: "100%", label: "Free" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-black dark:via-gray-900 dark:to-blue-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl animate-pulse">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            PhotoTools Studio
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Professional image processing tools for all your photo editing needs. Resize, compress, create layouts, and
            generate QR codes with ease.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center p-4 glass dark:glass-dark rounded-xl">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Why Choose PhotoTools Studio?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Built with modern web technologies for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 glass dark:glass-dark rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your Images?
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl opacity-90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                Start using our professional-grade image processing tools today. No registration required, completely
                free to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
                <a
                  href="/print-layout"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                >
                  <Printer className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Create Print Layout
                </a>
                <a
                  href="/resize"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/20 text-white border border-white/30 rounded-xl sm:rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  <ImageIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Resize Images
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
