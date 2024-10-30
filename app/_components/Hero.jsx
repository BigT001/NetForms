"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import KeyFeatures from "./KeyFeatures";
import HowItWorks from "./HowItWorks";
import LearnHow from "./LearnHow";
import ScreenshotHome from "./ScreenshotHome";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden mt-8 md:mt-6">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl lg:text-6xl font-extrabold pt-9">
              Create Your Form <br />
            </h1>
            <strong className="text-3xl lg:text-5xl font-extrabold text-primary sm:block">
              {" "}
              In Seconds Not Hours{" "}
            </strong>
            <p className="mt-4 sm:text-xl/relaxed mb-6 md:px-48">
              Transform Your Form Creation Process with a prompt. Build and
              Customize in Seconds, Not Hours.
            </p>

            <div className="justify-center lg:mb-16">
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
            </div>
          </>
        }
      >
        <ScreenshotHome />
      </ContainerScroll>

      <div className="lg:px-10 md:px-24 space-y-32">
        <KeyFeatures />
        <HowItWorks />
        <LearnHow />
      </div>
    </div>
  );
}
