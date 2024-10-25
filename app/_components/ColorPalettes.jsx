"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"

const colorPalettes = [
    {
      name: "Mystic Meadow",
      colors: ["#2D3A3A", "#5E8B7E", "#A7C4BC", "#DFEEEA", "#F2F2F2"],
      description: "A serene blend of muted greens and soft neutrals, evoking a misty forest atmosphere."
    },
    {
      name: "Cosmic Coral",
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDCB6E", "#6C5CE7"],
      description: "A vibrant mix inspired by coral reefs and cosmic nebulae, balancing warm and cool tones."
    },
    {
      name: "Rustic Charm",
      colors: ["#8B4513", "#CD853F", "#DEB887", "#F4A460", "#D2691E"],
      description: "Warm, earthy tones reminiscent of aged wood and autumn leaves."
    },
    {
      name: "Twilight Teal",
      colors: ["#004D61", "#00A5CF", "#25A18E", "#7AE582", "#00203F"],
      description: "Deep teals and vibrant aquas create a mysterious, underwater ambiance."
    },
    {
      name: "Lavender Dusk",
      colors: ["#4A0E4E", "#81267B", "#B565A7", "#D2A8D8", "#EAD3EA"],
      description: "A gradient of purple hues, from deep plum to soft lavender, reminiscent of a twilight sky."
    },
    {
      name: "Spice Market",
      colors: ["#D35400", "#E67E22", "#F39C12", "#F1C40F", "#FDE3A7"],
      description: "Rich, warm hues inspired by exotic spices, creating a vibrant and inviting atmosphere."
    },
    {
      name: "Arctic Aurora",
      colors: ["#1B1464", "#0652DD", "#1289A7", "#12CBC4", "#D980FA"],
      description: "Cool blues and vibrant purples reminiscent of the Northern Lights dancing across a night sky."
    },
    {
      name: "Urban Jungle",
      colors: ["#114B5F", "#1A936F", "#88D498", "#C6DABF", "#F3E9D2"],
      description: "A fresh, modern palette combining natural greens with urban grays and soft neutrals."
    },
    {
      name: "Terracotta Sunset",
      colors: ["#6D4C41", "#CD6155", "#F0B27A", "#F4D03F", "#F9E79F"],
      description: "Warm, earthy tones inspired by a desert sunset, from deep browns to soft yellows."
    },
    {
      name: "Midnight Orchid",
      colors: ["#2C3E50", "#8E44AD", "#9B59B6", "#D7BDE2", "#FAD7A0"],
      description: "Deep purples and blues accented with soft pastels, evoking the mystery of a night-blooming flower."
    }
  ]

function ColorPalette({ name, colors, description }) {
  const [copied, setCopied] = useState(false)

  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
    setCopied(true)
    toast({
      title: "Color copied!",
      description: `${color} has been copied to your clipboard.`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color, index) => (
            <Button
              key={index}
              className="w-full h-20 p-0 overflow-hidden"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
            >
              <span className="sr-only">Copy color {color}</span>
              <Copy className="w-4 h-4 text-white mix-blend-difference" />
            </Button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-center">
          {colors.map((color, index) => (
            <div key={index}>{color}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Component() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Unique Color Palettes</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {colorPalettes.map((palette, index) => (
          <ColorPalette key={index} {...palette} />
        ))}
      </div>
    </div>
  )
}