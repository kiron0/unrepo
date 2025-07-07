import { type Metadata } from "next"
import { getCachedUserData } from "@/utils"

import { Repos } from "@/components/shared/repos"

export async function generateMetadata(): Promise<Metadata> {
  const user = getCachedUserData()

  return {
    title: `${user?.login || "Repositories"}`,
  }
}

export default function Page() {
  return <Repos />
}
