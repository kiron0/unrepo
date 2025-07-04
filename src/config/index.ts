export const siteConfig = {
  name: "RemoveIt",
  title: "RemoveIt - GitHub Repository Manager",
  description:
    "The easiest way to clean up your GitHub account. Find and remove unwanted repositories in seconds.",
  url: "https://removeit.kiron.dev",
  slogan: "Your GitHub Cleanup Buddy",
  author: {
    name: "Toufiq Hasan Kiron",
  },
  links: {
    portfolio: "https://kiron.dev",
    twitter: "https://twitter.com/hashtagkiron",
  },
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
  ],
  logo: "/android-chrome-512x512.png",
  ogImage: "/og.png",
  storage: {
    TOKEN: "github_token",
    USER: {
      CACHE_KEY: "github_user_data",
      CACHE_EXPIRY_KEY: "github_user_data_expiry",
      CACHE_DURATION: 60 * 60 * 1000, // 1 hour
    },
    REPOS: {
      CACHE_KEY: "github_repos",
      CACHE_EXPIRY_KEY: "github_repos_data_expiry",
      CACHE_DURATION: 60 * 60 * 1000, // 1 hour
    },
  },
}

export type SiteConfig = typeof siteConfig
