import React from "react";

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Create your Form <br />
            <strong className="font-extrabold text-red-800 sm:block">
              {" "}
              In Seconds not hours{" "}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Transform Your Form Creation Process with a prompt. <br /> Build and
            Customize in Seconds, Not Hours.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-red-800 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              href="#"
            >
              + Create Form
            </a>

            <a
              className="block w-full rounded px-12 py-3 text-sm font-medium text-red-800 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
