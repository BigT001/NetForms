'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Component() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const cards = [
    { 
      title: "Enter Your Prompt", 
      description: "Describe the form you need in plain language.", 
      image: "Enterprompt.png" 
    },
    
    { 
      title: "AI Generates Form", 
      description: "Our AI creates a form based on your description.", 
      image: "generated.png" 
    },

    { 
      title: "Customize and Edit", 
      description: "Fine-tune your form and make it perfect.", 
      image: "/images/customize.svg" 
    },

    { 
      title: "Share Your Form", 
      description: "Share your form with your audience.", 
      image: "/images/share.svg" 
    },

    { 
      title: "Download/Export Response", 
      description: "Export and analyze your form responses.", 
      image: "/images/export.svg" 
    }
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          How It Works
        </h2>

        <div className="space-y-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.slice(0, 3).map((card, index) => (
              <motion.div
                key={index}
                className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="relative h-48">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center flex-grow">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-500">{card.description}</p>
                  {hoveredCard === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center text-primary"
                    >
                      <span className="mr-2">Learn more</span>
                      <ArrowRight size={20} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.slice(3).map((card, index) => (
              <motion.div
                key={index + 3}
                className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onHoverStart={() => setHoveredCard(index + 3)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="relative md:w-1/2 h-48 md:h-auto">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center flex-grow">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    {index + 4}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-500">{card.description}</p>
                  {hoveredCard === index + 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center text-primary"
                    >
                      <span className="mr-2">Learn more</span>
                      <ArrowRight size={20} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}