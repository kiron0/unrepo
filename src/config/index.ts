const CACHE_DURATION = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

const name = "UnRepo"
const slogan = "Your GitHub Cleanup Buddy"

export const siteConfig = {
  name,
  title: `${name} - ${slogan}`,
  description:
    "The easiest way to clean up your GitHub account. Find and remove unwanted repositories in seconds.",
  url: "https://unrepo.kiron.dev",
  slogan,
  author: {
    name: "Toufiq Hasan Kiron",
    role: "MERN Stack Developer",
    specializations: ["Next.js", "Node.js"],
    github: "https://github.com/kiron0",
    avatar: "https://avatars.githubusercontent.com/u/64346279?v=4",
  },
  links: {
    portfolio: "https://kiron.dev",
    twitter: "https://twitter.com/hashtagkiron",
  },
  keywords: [
    "GitHub",
    "Repository Manager",
    "GitHub Cleanup",
    "Remove Repositories",
    "GitHub Tools",
    "MERN Stack",
    "Next.js",
    "Node.js",
    "Open Source",
    "Developer Tools",
  ],
  logo: "/android-chrome-512x512.png",
  ogImage: "/og.png",
  storage: {
    TOKEN: {
      CACHE_KEY: "github_token",
      CACHE_DURATION,
    },
    USER: {
      CACHE_KEY: "github_user_data",
      CACHE_EXPIRY_KEY: "github_user_data_expiry",
      CACHE_DURATION,
    },
  },
}

export type SiteConfig = typeof siteConfig
