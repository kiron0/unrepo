import { getGitHubToken } from "@/utils"

import { About } from "@/components/shared/about"

export const dynamic = "force-dynamic"

export default async function Page() {
  const isLoggedIn = await getGitHubToken()

  return <About isLoggedIn={isLoggedIn} />
}
