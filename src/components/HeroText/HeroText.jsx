"use client";
import "./HeroText.css";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

export default function HeroText({ children, delay = 0, type = "lines" }) {
  const containerRef = useRef(null);
  const splitRef = useRef(null);
  const elements = useRef([]);

  const waitForFonts = async () => {
    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      console.warn("Font loading check failed, proceeding anyway:", error);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const initializeSplitText = async () => {
        // Hide content initially
        gsap.set(containerRef.current, { visibility: "hidden" });

        await waitForFonts();

        // Show the element
        gsap.set(containerRef.current, { visibility: "visible" });

        // Create split text based on type
        const splitType = type === "chars" ? "chars,words" : "lines";
        const split = SplitText.create(containerRef.current, {
          type: splitType,
          linesClass: "hero-line++",
          wordsClass: "hero-word++",
          charsClass: "hero-char++",
        });

        splitRef.current = split;

        // Wrap elements based on type
        if (type === "chars") {
          split.chars.forEach((char) => {
            const wrapper = document.createElement("span");
            wrapper.className = "hero-char-mask";
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "inline-block";
            char.parentNode.insertBefore(wrapper, char);
            wrapper.appendChild(char);
          });
          elements.current = split.chars;
        } else {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "hero-line-mask";
            wrapper.style.overflow = "hidden";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });
          elements.current = split.lines;
        }

        // Set initial position with scale for merge effect
        gsap.set(elements.current, { 
          y: type === "chars" ? "120%" : "110%",
          opacity: 0,
          scale: type === "chars" ? 1.1 : 1
        });

        // Animate with merge effect
        const animationProps = {
          y: "0%",
          opacity: 1,
          scale: 1,
          duration: type === "chars" ? 1 : 1.2,
          stagger: type === "chars" ? 0.03 : 0.1,
          ease: type === "chars" ? "power3.out" : "power4.out",
          delay: delay,
        };

        gsap.to(elements.current, animationProps);
      };

      initializeSplitText();

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
        }
      };
    },
    { scope: containerRef, dependencies: [delay, type] }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-hero-text-wrapper="true">
      {children}
    </div>
  );
}

