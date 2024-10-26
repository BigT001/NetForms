"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PenLine, Sparkles, Settings, Share2, Download } from 'lucide-react';

export default function HowItWorks() {
  const cards = [
    {
      title: "Enter Your Prompt",
      description: "Simply describe your ideal form in plain language. Our AI understands complex requirements and form structures.",
      icon: <PenLine className="w-6 h-6" />,
      color: "bg-blue-50"
    },
    {
      title: "AI Generates Form",
      description: "Watch as our advanced AI instantly creates a professional form matching your specifications with smart field validation.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-purple-50"
    },
    {
      title: "Customize and Edit",
      description: "Fine-tune your form with our intuitive editor. Add fields, modify layouts, and set up custom logic with ease.",
      icon: <Settings className="w-6 h-6" />,
      color: "bg-green-50"
    },
    {
      title: "Share Your Form",
      description: "Distribute your form via direct link, embed it on your website, or share through email. Track responses in real-time.",
      icon: <Share2 className="w-6 h-6" />,
      color: "bg-orange-50"
    },
    {
      title: "Download/Export Response",
      description: "Export responses in multiple formats (CSV, Excel, PDF). Generate insights with built-in analytics dashboard.",
      icon: <Download className="w-6 h-6" />,
      color: "bg-pink-50"
    }
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional forms in minutes with our AI-powered platform. No coding required.
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {cards.slice(0, 3).map((card, index) => (
              <div
                key={index}
                className={`${card.color} rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full`}
              >
                <div className="flex flex-col h-full">
                  <div className="bg-white rounded-xl p-3 w-fit shadow-sm mb-6">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-gray-700 flex-grow">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {cards.slice(3).map((card, index) => (
              <div
                key={index + 3}
                className={`${card.color} rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full`}
              >
                <div className="flex flex-col h-full">
                  <div className="bg-white rounded-xl p-3 w-fit shadow-sm mb-6">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                      {index + 4}
                    </div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-gray-700 flex-grow">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
