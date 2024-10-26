import React from 'react'
import { Zap, Shield, BarChart, Pencil, Sheet, FileDown } from "lucide-react"

export default function KeyFeatures() {
  return (
    <div>
      <section id="features" className="w-full pt-32 ">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <Zap className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">AI-Powered Generation</h3>
              <p className="text-gray-500">
                Create complex forms in seconds with our advanced natural language processing technology.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Enterprise-Level Security</h3>
              <p className="text-gray-500">
                Bank-grade encryption and compliance with GDPR, CCPA, and other data protection regulations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative">
              <span className="absolute -top-2 right-0 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                Coming Soon
              </span>
              <BarChart className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-gray-500">
                Gain valuable insights from your form submissions with our powerful analytics dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Pencil className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Edit/Customize</h3>
              <p className="text-gray-500">
                Customize your forms with our intuitive editor. Add, remove, or modify fields with ease to match your exact requirements.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <Sheet className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">View In Google Sheets</h3>
              <p className="text-gray-500">
                Seamlessly integrate form responses with Google Sheets for real-time data access and collaborative analysis.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <FileDown className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold mb-2">CSV Download</h3>
              <p className="text-gray-500">
                Export your form responses instantly in CSV format for easy data processing and integration with other tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
