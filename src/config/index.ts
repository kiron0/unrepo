export const siteConfig = {
  name: "UnRepo",
  title: "UnRepo - GitHub Repository Manager",
  description:
    "The easiest way to clean up your GitHub account. Find and remove unwanted repositories in seconds.",
  url: "https://unrepo.kiron.dev",
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
      CACHE_DURATION: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    REPOS: {
      CACHE_KEY: "github_repos",
      CACHE_EXPIRY_KEY: "github_repos_data_expiry",
      CACHE_DURATION: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
}

export type SiteConfig = typeof siteConfig
