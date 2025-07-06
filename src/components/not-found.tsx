"use client"

import Image from "next/image"
import Link from "next/link"
import { MoveLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/not-found.webp"
          alt="Not Found"
          width={800}
          height={600}
          className="w-96 select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <p className="mt-3 px-4 text-center text-base md:px-0 md:text-lg">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className={buttonVariants({
            size: "sm",
            className: "mt-5 flex items-center gap-2 text-xs",
          })}
        >
          <MoveLeft />
          Go home
        </Link>
      </div>
    </div>
  )
}
