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
          color: '#000000', // This ensures dark text on all devices
        },
        classNames: {
          toast: "font-semibold text-lg text-black dark:text-white", // Added explicit text colors
          success: "text-green-600 dark:text-green-400",
          error: "text-red-600 dark:text-red-400",
          loading: "text-blue-600 dark:text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
