import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./client-layout"

const _geist = { subsets: ["latin"] }
const _geistMono = { subsets: ["latin"] }

export const metadata: Metadata = {
  title: "Waseem - Portfolio",
  description: "Waseem's professional developer portfolio and experience",
  generator: "Next.js",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
