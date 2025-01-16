"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      duration={3000}
      toastOptions={{
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        },
        classNames: {
          toast: "font text-md",
          success: "text-primary",
          error: "text-red-600",
          loading: "text-blue-600",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
