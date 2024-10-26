import HeroVideoDialog from '@/components/ui/hero-video-dialog'
import React from 'react'

function LearnHow() {
  return (
    <div className="relative">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        Watch Detailed video on how to use NetForms
        </h2>
          <HeroVideoDialog
            className="dark:hidden block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>
  )
}

export default LearnHow
