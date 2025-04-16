import type React from "react"
// If there's an app/layout.tsx file, ensure it's properly set up
import { ThemeProvider } from "@/components/theme-provider"

// Make sure the ThemeProvider is wrapping the children
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
