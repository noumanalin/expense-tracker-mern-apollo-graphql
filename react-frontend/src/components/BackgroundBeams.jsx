"use client";
import React from "react";
import { motion } from "framer-motion";

// Utility function to join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const BackgroundBeams = React.memo(({ className = "" }) => {
const paths = [
//   "M-380 -189C-380 -189 -312 116 152 243C616 370 684 575 684 575",
//   "M-366 -205C-366 -205 -298 100 166 227C630 354 698 559 698 559",
//   "M-352 -221C-352 -221 -284 90 180 211C644 338 712 543 712 543",
//   "M-338 -237C-338 -237 -270 80 194 195C658 322 726 527 726 527",
//   "M-324 -253C-324 -253 -256 70 208 179C672 306 740 511 740 511",

      // From left to right
    "M-300 -150C-300 -150 -200 200 200 400C600 600 700 800 700 800",
    "M-280 -180C-280 -180 -180 220 220 420C620 620 720 820 720 820",
    "M-260 -200C-260 -200 -160 240 240 440C640 640 740 840 740 840",
    "M-240 -220C-240 -220 -140 260 260 460C660 660 760 860 760 860",

    // From right to left
    "M1000 -150C1000 -150 800 200 400 400C0 600 -100 800 -100 800",
    "M980 -180C980 -180 780 220 380 420C-20 620 -120 820 -120 820",
    "M960 -200C960 -200 760 240 360 440C-40 640 -140 840 -140 840",
    "M940 -220C940 -220 740 260 340 460C-60 660 -160 860 -160 860",

    // From top to bottom
    "M100 0C100 0 300 200 400 500C500 800 600 1000 600 1000",
    "M200 0C200 0 350 250 450 550C550 850 650 1050 650 1050",
    "M300 0C300 0 400 300 500 600C600 900 700 1100 700 1100",
    "M400 0C400 0 450 350 550 650C650 950 750 1150 750 1150",

    // Diagonal mix (adds motion diversity)
    "M-200 200C-200 200 100 300 500 600C900 900 1200 1200 1200 1200",
    "M1200 200C1200 200 900 300 500 600C100 900 -200 1200 -200 1200",
    "M0 -300C0 -300 200 0 500 500C800 1000 1000 1300 1000 1300",
    "M600 -300C600 -300 500 0 400 500C300 1000 200 1300 200 1300",
];

  return (
    <div
      className={cn(
        "absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        viewBox="0 0 696 316"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Base static background line */}
        <path
          d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
          stroke="url(#paint0_radial)"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />

        {/* Animated lines */}
        {paths.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke={`url(#linearGradient-${i})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}

        {/* Gradients */}
        <defs>
          {paths.map((_, i) => (
            <motion.linearGradient
              key={i}
              id={`linearGradient-${i}`}
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            >
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#18CCFC" />
              <stop offset="32.5%" stopColor="#6344F5" />
              <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
            </motion.linearGradient>
          ))}

          <radialGradient
            id="paint0_radial"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
          >
            <stop offset="0.0666" stopColor="#d4d4d4" />
            <stop offset="0.24" stopColor="#d4d4d4" />
            <stop offset="0.43" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
});

BackgroundBeams.displayName = "BackgroundBeams";
