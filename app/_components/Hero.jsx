"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import KeyFeatures from "./KeyFeatures";
import HowItWorks from "./HowItWorks";
import ColorPalettes from "./ColorPalettes";


export default function Hero() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl font-extrabold sm:text-5xl">
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

            <div className="flex justify-center gap-4 mb-8">
              <a
                className="rounded bg-primary px-12 py-3 text-sm font-medium 
              text-white shadow hover:bg-secondary focus:outline-none focus:ring 
              active:bg-primary"
                href="#"
              >
                + Create Form
              </a>
              <a
                className="rounded px-12 py-3 text-sm font-medium text-primary shadow 
               hover:text-secondary focus:outline-none focus:ring active:text-primary"
                href="#"
              >
                How To Use
              </a>
            </div>
          </>
        }
      >
        <Image
          src={`/netformedith.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>

      <div className="px-24">
        <KeyFeatures />
        <HowItWorks />
        <ColorPalettes />
      </div>
    </div>
  );
}
