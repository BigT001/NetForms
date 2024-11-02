"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import KeyFeatures from "./KeyFeatures";
import Testimonials from "./Testimonials";
import HowItWorks from "./HowItWorks";
import LearnHow from "./LearnHow";
import ScreenshotHome from "./ScreenshotHome";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Footer from "./Footer";

export default function Hero() {
  const { isSignedIn } = useAuth();

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col overflow-hidden mt-8 md:mt-6">
      <ContainerScroll
        titleComponent={
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.h1 
                variants={titleVariants}
                className="text-4xl lg:text-6xl font-extrabold pt-9"
              >
                Create Your Form <br />
              </motion.h1>
              
              <motion.strong 
                variants={titleVariants}
                className="text-3xl lg:text-5xl font-extrabold text-primary sm:block"
              >
                {" "}
                In Seconds <span className="text-secondary">Not Hours{" "}</span>
              </motion.strong>

              <motion.p 
                variants={titleVariants}
                className="mt-4 sm:text-xl/relaxed mb-6 md:px-48"
              >
                Transform Your Form Creation Process with a prompt. Build and
                Customize in Seconds, Not Hours.
              </motion.p>

              <motion.div 
                variants={buttonVariants}
                whileHover="hover"
                className="justify-center lg:mb-16"
              >
                {isSignedIn ? (
                  <a href="/userDashboard">
                    <Button className="bg-primary hover:bg-secondary font-bold">
                      Create Your Form
                    </Button>
                  </a>
                ) : (
                  <a
                    className="focus:outline-none focus:ring active:bg-primary"
                    href="/sign-in"
                  >
                    <SignInButton>
                      <Button className="hover:bg-secondary font-bold">
                        Get Started For Free
                      </Button>
                    </SignInButton>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </>
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <ScreenshotHome />
        </motion.div>
      </ContainerScroll>

      <div className="lg:px-10 md:px-24 space-y-32">
        <KeyFeatures />
        <HowItWorks />
        {/* <LearnHow /> */}
        <Testimonials/>
        <Footer/>
      </div>
    </div>
  );
}
