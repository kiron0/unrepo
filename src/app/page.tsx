import { getGitHubToken } from "@/utils/cookies"

import { Home } from "@/components/shared/home"

export const dynamic = "force-dynamic"

export default async function Page() {
  const isLoggedIn = await getGitHubToken()

  return <Home isLoggedIn={isLoggedIn} />
}
