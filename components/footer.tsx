import { Heart, Github, Twitter, Mail, Sparkles, Camera, Star } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const toolLinks = [
    { href: "/print-layout", label: "Print Layout Maker", icon: "🖨️" },
    { href: "/resize", label: "Image Resizer", icon: "📏" },
    { href: "/compress", label: "Image Compressor", icon: "🗜️" },
    { href: "/kb-reducer", label: "KB Reducer", icon: "🎯" },
    { href: "/qr", label: "QR Generator", icon: "📱" },
  ]

  const supportLinks = [
    { href: "/contact", label: "Contact Us", icon: "📧" },
    { href: "#", label: "Help Center", icon: "❓" },
    { href: "#", label: "Privacy Policy", icon: "🔒" },
    { href: "#", label: "Terms of Service", icon: "📋" },
  ]

  const socialLinks = [
    { href: "#", icon: Github, label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
    { href: "#", icon: Twitter, label: "Twitter", color: "hover:text-blue-500" },
    { href: "mailto:asaadsiddiqui1516@gmail.com", icon: Mail, label: "Email", color: "hover:text-red-500" },
  ]

  const features = [
    "🚀 Lightning Fast Processing",
    "🔒 100% Privacy Protected",
    "💎 Professional Quality",
    "📱 Mobile Optimized",
  ]

  return (
    <footer className="relative overflow-hidden border-t border-white/20 dark:border-gray-800/50 glass dark:glass-dark mt-16 sm:mt-20 lg:mt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20"></div>

      <div className="relative container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PhotoTools Studio
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">Professional Grade</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Professional image processing tools for all your photo editing needs. All processing happens locally in
              your browser for maximum privacy and security.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ${social.color} border border-gray-200 dark:border-gray-700`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <h3 className="font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
              Tools
            </h3>
            <ul className="space-y-3">
              {toolLinks.map((tool, index) => (
                <li key={index}>
                  <Link
                    href={tool.href}
                    className="group flex items-center space-x-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                    <span>{tool.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-center space-x-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 dark:border-gray-800/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <p>© 2024 PhotoTools Studio. All rights reserved.</p>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
              <p>Built with Next.js & Tailwind CSS</p>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-muted-foreground">by</span>
              <a
                href="mailto:asaadsiddiqui1516@gmail.com"
                className="group font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-1"
              >
                <span>Asaad Siddiqui</span>
                <Mail className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
