import type { Metadata } from "next"
import { siteConfig } from "@/config"
import { getBaseURL } from "@/utils"

import { NotFound } from "@/components/not-found"

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = await getBaseURL()

  return {
    metadataBase: new URL(BASE_URL),
    title: "404 Not Found",
    description:
      "Hey, this page does not exist. Please check the URL and try again. If you think this is a mistake, please let me know.",
    openGraph: {
      images: [
        {
          url: new URL("/not-found.webp", BASE_URL),
          width: 800,
          height: 600,
          alt: siteConfig.title,
        },
      ],
    },
  }
}

export default function Page() {
  return <NotFound />
}
