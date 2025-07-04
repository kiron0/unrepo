"use client"

import { useState } from "react"
import type { Repository } from "@/types"
import { Trash2 } from "lucide-react"
import moment from "moment"
import { FaStar } from "react-icons/fa"
import { GoRepoForked } from "react-icons/go"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`repo-${repo.id}`}
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(repo.full_name)}
              className="mt-2"
            />
            <div>
              <CardTitle className="text-lg">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </a>
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {repo.description || "No description"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {repo.language && (
                  <Badge variant="secondary">{repo.language}</Badge>
                )}
                {repo.private && <Badge variant="outline">Private</Badge>}
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <FaStar className="text-yellow-500" /> {repo.stargazers_count}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-sm">
                  <GoRepoForked /> {repo.forks_count}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Last updated {moment(repo.updated_at).fromNow()} (
                {moment(repo.updated_at).format("MMM Do, YYYY, hh:mm:ss A")})
              </p>
            </div>
          </div>
          <AlertDialogHelper
            trigger={
              <Button variant="destructive" size="sm">
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
      </CardHeader>
    </Card>
  )
}
