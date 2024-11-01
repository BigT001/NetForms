
"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import Masonry from "react-masonry-css"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
    {
      name: "Tunde Oyedele",
      role: "Social Media Manager",
      content: "Love how easy it is to create forms with this tool! Saves me so much time.",
      rating: 5,
    },
    {
      name: "Nelly Okoro",
      role: "Marketing Director",
      content: "This form generator has simplified our data collection process. Excited to see how it evolves!",
      rating: 5,
    },
    {
      name: "Franker Johnson",
      role: "Freelance Designer",
      content: "Clean design and intuitive interface. Looking forward to more features!",
      rating: 4,
    },
    {
      name: "Amaka Didi",
      role: "Virtual Assistant",
      content: "Finally, a form builder that's easy to use! No more headaches.",
      rating: 5,
    },
    {
      name: "Stanley Omaru",
      role: "Software Engineer",
      content: "Impressed with the simplicity and potential. Would love to see more customization options.",
      rating: 4,
    },
    {
      name: "Yewande Bakare",
      role: "UX Researcher",
      content: "This tool shows promise. Excited to explore its capabilities further.",
      rating: 5,
    },
    {
        name: "Tunde Oyedele",
        role: "Social Media Manager",
        content: "Love how easy it is to create forms with this tool! Saves me so much time.",
        rating: 5,
      },
      {
        name: "Nelly Okoro",
        role: "Marketing Director",
        content: "This form generator has simplified our data collection process. Excited to see how it evolves!",
        rating: 5,
      },
      {
        name: "Franker Johnson",
        role: "Freelance Designer",
        content: "Clean design and intuitive interface. Looking forward to more features!",
        rating: 4,
      },
      {
        name: "Amaka Didi",
        role: "Virtual Assistant",
        content: "Finally, a form builder that's easy to use! No more headaches.",
        rating: 5,
      },
      {
        name: "Stanley Omaru",
        role: "Software Engineer",
        content: "Impressed with the simplicity and potential. Would love to see more customization options.",
        rating: 4,
      },
      {
        name: "Yewande Bakare",
        role: "UX Researcher",
        content: "This tool shows promise. Excited to explore its capabilities further.",
        rating: 5,
      },
      {
        name: "Tunde Oyedele",
        role: "Social Media Manager",
        content: "Love how easy it is to create forms with this tool! Saves me so much time.",
        rating: 5,
      },
      {
        name: "Nelly Okoro",
        role: "Marketing Director",
        content: "This form generator has simplified our data collection process. Excited to see how it evolves!",
        rating: 5,
      },
      {
        name: "Franker Johnson",
        role: "Freelance Designer",
        content: "Clean design and intuitive interface. Looking forward to more features!",
        rating: 4,
      },
      {
        name: "Amaka Didi",
        role: "Virtual Assistant",
        content: "Finally, a form builder that's easy to use! No more headaches.",
        rating: 5,
      },
      {
        name: "Stanley Omaru",
        role: "Software Engineer",
        content: "Impressed with the simplicity and potential. Would love to see more customization options.",
        rating: 4,
      },
      {
        name: "Yewande Bakare",
        role: "UX Researcher",
        content: "This tool shows promise. Excited to explore its capabilities further.",
        rating: 5,
      },
  ]
const CloudShape = ({ className }: { className?: string }) => (
<svg viewBox="0 0 200 100" className={className}>
<path
d="M0 50 Q50 0 100 50 T200 50 V100 H0Z"
fill="currentColor"
/>
</svg>
)

export default function MovingMasonryTestimonials() {
const controls = useAnimation()
const containerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
const animateScroll = async () => {
await controls.start({
y: [0, -1000],
transition: {
y: {
repeat: Infinity,
repeatType: "loop",
duration: 40,
ease: "linear",
},
},
})
}

animateScroll()
}, [controls])

const breakpointColumnsObj = {
default: 3,
1100: 2,
700: 1
}

return (
<section className=" from-white to-gray-100 overflow-hidden relative">
<div className="absolute top-0 left-0 right-0 text-white h-24 w-full" />
<div className="absolute bottom-0 left-0 right-0 text-gray-100 h-24 w-full transform rotate-180" />
<div className="container mx-auto px-4 relative">
<h2 className="text-5xl font-bold text-secondary text-center mb-12">
Reviews
</h2>
<div
ref={containerRef}
className="h-[600px] overflow-hidden relative"
style={{
maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
}}
>
<motion.div animate={controls}>
<Masonry
breakpointCols={breakpointColumnsObj}
className="flex w-auto -ml-4"
columnClassName="pl-4 bg-clip-padding"
>
{[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
<motion.div
key={index}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
className="mb-4"
>
<Card className="w-full border-primary overflow-hidden">
<CardContent className="p-6 flex flex-col justify-between">
<div>
<p className="text-gray-600 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
<div className="flex mb-2">
{[...Array(testimonial.rating)].map((_, i) => (
<Star key={i} className="w-5 h-5 fill-primary text-secondary" />
))}
</div>
</div>
<div className="mt-4">
<p className="font-semibold">{testimonial.name}</p>
<p className="text-sm text-gray-500">{testimonial.role}</p>
</div>
</CardContent>
</Card>
</motion.div>
))}
</Masonry>
</motion.div>
</div>
</div>
</section>
)
} 