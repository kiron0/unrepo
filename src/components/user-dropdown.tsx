"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clearCachedUserData, getCachedUserData } from "@/utils/cache"
import axios from "axios"
import { LogOutIcon, UserIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { GoRepo } from "react-icons/go"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"
import { notifySuccess } from "@/components/toast"

interface UserDropdownProps {
  className?: string
  contentClassName?: string
}

export function UserDropdown({
  className,
  contentClassName,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const user = getCachedUserData()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await axios.post("/api/auth/sign-out")
      if (res.status === 200) {
        notifySuccess({
          description: "You have been logged out successfully.",
        })
      }

      await clearCachedUserData()

      if (pathname !== "/") {
        router.push("/")
      }

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end">
        <p className="from-primary to-secondary bg-gradient-to-tr bg-clip-text font-medium text-transparent">
          Hello, {user?.name?.split(" ")?.[0]}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "cursor-pointer focus:bg-transparent focus-visible:ring-0 focus-visible:outline-none",
            className
          )}
        >
          <div className="rounded-full p-1 ring-1">
            <Avatar className="size-6">
              <AvatarImage
                src={user?.avatar_url}
                alt="User"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="select-none"
              />
              <AvatarFallback className="bg-background/30 text-sm text-white">
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "bg-background mt-4 w-72 rounded-xl sm:mt-6",
            contentClassName
          )}
        >
          <DropdownMenuLabel>
            <div className="mt-5 flex flex-col items-center justify-center gap-3">
              <div className="ring-primary rounded-full p-1 ring-1">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.avatar_url}
                    alt={user?.name}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="select-none"
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold sm:text-base">
                  {user?.name}
                </p>
                <p className="text-muted-foreground text-xs">{user?.login}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <Separator className="my-2" />
          <Link href="/profile">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 py-2">
              <UserIcon /> Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/repos">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 py-2">
              <GoRepo /> Repositories
            </DropdownMenuItem>
          </Link>
          <AlertDialogHelper
            trigger={
              <div className="focus:bg-accent focus:text-accent-foreground sm:hover:bg-accent sm:hover:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <LogOutIcon className="h-4 w-4" />
                Logout
              </div>
            }
            title="Are you sure you want to logout?"
            description="You will be logged out and redirected to the home page."
            func={handleLogout}
            open={isOpen}
            setOpen={setIsOpen}
            disabled={isLoggingOut}
            isLoading={isLoggingOut}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
