import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Providers } from "@/providers"

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", spaceGrotesk.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
