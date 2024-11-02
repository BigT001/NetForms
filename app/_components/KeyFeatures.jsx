"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart, Pencil, Sheet, FileDown } from "lucide-react";

export default function KeyFeatures() {
  const features = [
    {
      icon: <Zap className="h-12 w-12 mb-4 text-primary" />,
      title: "AI-Powered Generation",
      description: "Create complex forms in seconds with our advanced natural language processing technology powered by open AI."
    },
    {
      icon: <Shield className="h-12 w-12 mb-4 text-primary" />,
      title: "Enterprise-Level Security",
      description: "Bank-grade encryption and compliance with GDPR, CCPA, and other data protection regulations."
    },
    {
      icon: <BarChart className="h-12 w-12 mb-4 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain valuable insights from your form submissions with our powerful analytics dashboard.",
      comingSoon: true
    },
    {
      icon: <Pencil className="h-12 w-12 mb-4 text-primary" />,
      title: "Edit/Customize",
      description: "Customize your forms with our intuitive editor. Add, remove, or modify fields with ease to match your exact requirements."
    },
    {
      icon: <Sheet className="h-12 w-12 mb-4 text-primary" />,
      title: "View In Google Sheets",
      description: "Seamlessly integrate form responses with Google Sheets for real-time data access and collaborative analysis."
    },
    {
      icon: <FileDown className="h-12 w-12 mb-4 text-primary" />,
      title: "CSV Download",
      description: "Export your form responses instantly in CSV format for easy data processing and integration with other tools."
    }
  ];

  return (
    <div>
      <section id="features" className="w-full pt-32">
        <div className="container px-4 md:px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-secondary mb-12"
          >
            Key Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="flex flex-col items-center text-center relative"
              >
                {feature.comingSoon && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-2 right-0 bg-secondary text-white text-xs px-2 py-1 rounded-full"
                  >
                    Coming Soon
                  </motion.span>
                )}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
