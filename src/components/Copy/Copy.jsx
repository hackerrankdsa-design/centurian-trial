"use client";
import "./Copy.css";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({ children, animateOnScroll = true, delay = 0 }) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const lines = useRef([]);

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
        // Hide content initially to prevent flash
        let elements = [];
        if (containerRef.current.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(containerRef.current.children);
        } else {
          elements = [containerRef.current];
        }
        
        gsap.set(elements, { visibility: "hidden" });

        await waitForFonts();

        splitRefs.current = [];
        lines.current = [];
        elementRefs.current = [];

        // Now show the elements
        gsap.set(elements, { visibility: "visible" });

        elements.forEach((element) => {
          elementRefs.current.push(element);

          const split = SplitText.create(element, {
            type: "lines",
            linesClass: "line++",
          });

          splitRefs.current.push(split);

          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line-mask";
            wrapper.style.overflow = "hidden";
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          lines.current.push(...split.lines);
        });

        gsap.set(lines.current, { y: "110%" });

        const animationProps = {
          y: "0%",
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: delay,
        };

        if (animateOnScroll) {
          gsap.to(lines.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              once: true,
            },
          });
        } else {
          // For immediate animations, ensure they run after split is complete
          gsap.to(lines.current, animationProps);
        }
      };

      initializeSplitText();

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}

