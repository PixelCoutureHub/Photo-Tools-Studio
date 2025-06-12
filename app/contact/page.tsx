"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Send,
  MessageCircle,
  User,
  Sparkles,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Globe,
  CheckCircle,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create mailto link with form data
    const mailtoLink = `mailto:asaadsiddiqui1516@gmail.com?subject=${encodeURIComponent(
      formData.subject || "Contact from PhotoTools Studio",
    )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`

    // Open email client
    window.location.href = mailtoLink

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "#", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-blue-500" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-600" },
    { icon: Globe, label: "Website", href: "#", color: "hover:text-green-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-black dark:via-gray-900 dark:to-blue-950 grid-bg dark:grid-bg-dark">
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl">
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or just want to say hello? I'd love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                        <p className="text-sm text-muted-foreground">Direct contact</p>
                      </div>
                    </div>
                    <a
                      href="mailto:asaadsiddiqui1516@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors break-all"
                    >
                      asaadsiddiqui1516@gmail.com
                    </a>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                        <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                      Fast Response
                    </Badge>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Connect with me</h3>
                    <div className="flex space-x-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ${social.color}`}
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Made with Love</h3>
                    <p className="text-sm text-muted-foreground">
                      PhotoTools Studio is crafted with passion to help you create amazing visuals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl glass dark:glass-dark">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-xl">
                    <Send className="mr-3 h-6 w-6 text-purple-500" />
                    Send me a message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Client Opened!</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Your default email client should have opened with a pre-filled message. If not, you can manually
                        email me at:
                      </p>
                      <a
                        href="mailto:asaadsiddiqui1516@gmail.com"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        asaadsiddiqui1516@gmail.com
                      </a>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="mt-4 ml-4 glass dark:glass-dark border-0"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">
                            Your Name
                          </Label>
                          <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="pl-10 h-12"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">
                            Your Email
                          </Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10 h-12"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="mt-1 h-12"
                          placeholder="What's this about?"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          className="mt-1 resize-none"
                          placeholder="Tell me about your thoughts, suggestions, or questions..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg border-0 rounded-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                            Opening Email Client...
                          </>
                        ) : (
                          <>
                            <Send className="mr-3 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        This will open your default email client with a pre-filled message to{" "}
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          asaadsiddiqui1516@gmail.com
                        </span>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
