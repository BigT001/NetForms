"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      duration={4000}
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          padding: "0",
          boxShadow: "none",
        },
        classNames: {
          toast: "group flex items-center gap-3",
          title: "font-semibold text-base",
          description: "text-sm text-muted-foreground",
        },
      }}
    />
  )
}
