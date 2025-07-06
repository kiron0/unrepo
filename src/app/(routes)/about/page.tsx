import { getGitHubToken } from "@/utils/cookies"

import { About } from "@/components/shared/about"

export const dynamic = "force-dynamic"

export default async function Page() {
  const isLoggedIn = await getGitHubToken()

  return <About isLoggedIn={isLoggedIn} />
}
