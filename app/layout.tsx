import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

export const metadata = {
      generator: 'v0.dev'
    };
