import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

import { cn } from "@/lib/utils"

import "@/styles/globals.css"

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Repo Remover - GitHub Repository Manager",
  description:
    "The easiest way to clean up your GitHub account. Find and remove unwanted repositories in seconds.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", spaceGrotesk.className)}>
        {children}
      </body>
    </html>
  )
}
