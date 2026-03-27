"use client";
import "./Preloader.css";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const logoRef = useRef(null);
  const capitalRef = useRef(null);
  const oneRef = useRef(null);
  const jvcRef = useRef(null);

  useEffect(() => {
    // Animate text in character by character
    const tl = gsap.timeline({ delay: 0.2 });

    if (capitalRef.current) {
      const chars = capitalRef.current.querySelectorAll('.char');
      tl.fromTo(
        chars,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" },
        0
      );
    }

    if (oneRef.current) {
      const chars = oneRef.current.querySelectorAll('.char');
      tl.fromTo(
        chars,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" },
        0.3
      );
    }

    if (jvcRef.current) {
      const chars = jvcRef.current.querySelectorAll('.char');
      tl.fromTo(
        chars,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" },
        0.6
      );
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 180);

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Animate out the preloader with text merging into hero
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Fade out progress percentage first
      tl.to(".preloader-progress", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      // Fade out decorative lines
      .to(".logo-line-decorator", {
        opacity: 0,
        width: 0,
        duration: 0.5,
        ease: "power2.in",
      }, "-=0.2")
      // Move and scale the text up as if merging into hero
      .to(logoRef.current, {
        y: -100,
        scale: 0.9,
        opacity: 0.8,
        duration: 0.8,
        ease: "power2.inOut",
      }, "-=0.3")
      // Fade out towers
      .to(".preloader-towers", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.5")
      // Finally fade out entire preloader
      .to(".preloader", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.2");
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader">
      <div className="preloader-towers preloader-towers-top"></div>
      <div className="preloader-towers preloader-towers-bottom"></div>
      
      <div className="preloader-content">
        <div ref={logoRef} className="preloader-logo">
          <div className="logo-line logo-line-main">
            <div className="logo-text" ref={capitalRef}>
              {'CAPITAL'.split('').map((char, i) => (
                <span key={`capital-${i}`} className="char">{char}</span>
              ))}
            </div>
            <div className="logo-text logo-text-one" ref={oneRef}>
              {'ONE'.split('').map((char, i) => (
                <span key={`one-${i}`} className="char">{char}</span>
              ))}
            </div>
          </div>
          <div className="logo-line logo-line-jvc">
            <div className="logo-line-decorator logo-line-left"></div>
            <div className="logo-text logo-text-jvc" ref={jvcRef}>
              {'JVC'.split('').map((char, i) => (
                <span key={`jvc-${i}`} className="char">{char}</span>
              ))}
            </div>
            <div className="logo-line-decorator logo-line-right"></div>
          </div>
        </div>
        <div className="preloader-progress">
          <div className="progress-text">
            {Math.floor(Math.min(progress, 100))}%
          </div>
        </div>
      </div>
    </div>
  );
}

