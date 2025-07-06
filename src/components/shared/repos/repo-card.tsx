"use client"

import { useState } from "react"
import type { Repository } from "@/types"
import { Trash2 } from "lucide-react"
import moment from "moment"
import { FaStar } from "react-icons/fa"
import { GoRepoForked } from "react-icons/go"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialogHelper } from "@/components/alert-dialog-helper"

interface RepoCardProps {
  repo: Repository
  isSelected: boolean
  onToggleSelection: (fullName: string) => void
  onDelete: (fullName: string) => Promise<void>
}

export function RepoCard({
  repo,
  isSelected,
  onToggleSelection,
  onDelete,
}: RepoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(repo.full_name).then(() => {
        setIsDeleteOpen(false)
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card
      className={cn(
        "hover:ring-primary relative cursor-pointer transition-all duration-300 hover:shadow-md hover:ring",
        isSelected ? "ring-primary ring" : ""
      )}
      onClick={() => onToggleSelection(repo.full_name)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-6 right-6"
      >
        <AlertDialogHelper
          trigger={
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 />
            </Button>
          }
          title={`Delete Repository "${repo.name}"`}
          description={`This action cannot be undone. The repository "${repo.name}" will be permanently deleted.`}
          func={() => handleDelete()}
          disabled={isDeleting}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Checkbox
            id={`repo-${repo.id}`}
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(repo.full_name)}
            onClick={(e) => e.stopPropagation()}
          />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-2/3 items-center truncate hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {repo.name}
          </a>
        </CardTitle>
        <CardDescription>
          {repo.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
        {repo.private && <Badge variant="outline">Private</Badge>}
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <FaStar className="text-yellow-500" /> {repo.stargazers_count}
        </p>
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <GoRepoForked /> {repo.forks_count}
        </p>
      </CardContent>
      <CardFooter className="text-muted-foreground text-xs">
        Last updated {moment(repo.updated_at).fromNow()} (
        {moment(repo.updated_at).format("MMM Do, YYYY, hh:mm:ss A")})
      </CardFooter>
    </Card>
  )
}
