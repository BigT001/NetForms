'use client'

import React, { useState } from 'react'
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ShareButton({ formId, formTitle, formSubheading }) {
  const [copied, setCopied] = useState(false)
  const [shareDescription, setShareDescription] = useState(`Say something about your form: ${formTitle}`)
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}netform/${formId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareDescription}\n\n${shareUrl}`)
    setCopied(true)
    toast.success('Link copied!', {
      description: 'The form link and description have been copied to your clipboard.',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareDescription)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareDescription)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareDescription)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareDescription}\n${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(formTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`,
  }

  const ShareOption = ({ icon, label, onClick, color }) => (
    <Button
      variant="outline"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 h-auto text-center transition-all duration-300 hover:scale-105 hover:bg-${color}-50 hover:text-${color}-600 hover:border-${color}-200 rounded-xl`}
    >
      <div className="mb-3">
        {React.cloneElement(icon, { className: "h-10 w-10" })}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="sm"
          variant="outline"
          className="flex gap-2 font-semibold hover:bg-transparent hover:border-b-2 border-black"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="sm:max-w-xl sm:mx-auto sm:w-full">
        {/* <SheetHeader className="text-left pb-4 border-b">
          <SheetTitle className="text-xl font-bold">{formTitle}</SheetTitle>
          <SheetDescription className="text-sm">{formSubheading}</SheetDescription>
        </SheetHeader> */}
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Customize your share message</h3>
            <Input
              value={shareDescription}
              onChange={(e) => setShareDescription(e.target.value)}
              placeholder="Enter your custom share message"
              className="w-full text-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Share link</h3>
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-grow text-sm bg-gray-50 w-3/4"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className={`transition-all duration-300 hover:scale-105 ${copied ? 'bg-green-100 text-primary hover:bg-secondary' : ''}`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Share on social media</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <ShareOption
                icon={<Facebook />}
                label="Facebook"
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                color="blue"
              />
              <ShareOption
                icon={<Twitter />}
                label="Twitter"
                onClick={() => window.open(shareLinks.twitter, '_blank')}
                color="sky"
              />
              <ShareOption
                icon={<Linkedin />}
                label="LinkedIn"
                onClick={() => window.open(shareLinks.linkedin, '_blank')}
                color="indigo"
              />
              <ShareOption
                icon={<MessageCircle />}
                label="WhatsApp"
                onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                color="green"
              />
              <ShareOption
                icon={<Send />}
                label="Email"
                onClick={() => window.open(shareLinks.email, '_blank')}
                color="emerald"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
