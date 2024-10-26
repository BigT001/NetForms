"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import KeyFeatures from "./KeyFeatures";
import HowItWorks from "./HowItWorks";
import LearnHow from "./LearnHow";
import ScreenshotHome from "./ScreenshotHome";

export default function Hero() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl font-extrabold pt-16">
              Create Your Form <br />
              <strong className="font-extrabold text-primary sm:block">
                {" "}
                In Seconds Not Hours{" "}
              </strong>
            </h1>
            <p className="mt-4 sm:text-xl/relaxed mb-10">
              Transform Your Form Creation Process with a prompt. <br /> Build
              and Customize in Seconds, Not Hours.
            </p>

            <div className="flex justify-center gap-4 mb-16">
              <a
                className="rounded bg-primary px-12 py-3 text-sm font-bold 
              text-white shadow hover:bg-secondary hover:border-secondary  focus:outline-none focus:ring 
              active:bg-primary"
                href="#"
              >
                Get Started For Free
              </a>
            </div>
          </>
        }
      >
        <ScreenshotHome />
      </ContainerScroll>

      <div className="px-10 md:px-24 space-y-32">
        <KeyFeatures />
        <HowItWorks />
        <LearnHow />
      </div>
    </div>
  );
}
