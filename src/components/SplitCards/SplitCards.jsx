"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import "./SplitCards.css";

gsap.registerPlugin(ScrollTrigger);

const SplitCards = () => {
  const sectionRef = useRef(null);
  const cardContainerRef = useRef(null);
  const stickyHeaderRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current || !cardContainerRef.current || !stickyHeaderRef.current) return;

    const section = sectionRef.current;
    const cardContainer = cardContainerRef.current;
    const stickyHeader = stickyHeaderRef.current;

    let isGapAnimationCompleted = false;
    let isFlipAnimationCompleted = false;

    // Set initial states
    gsap.set(stickyHeader, { y: 40, opacity: 0 });
    gsap.set(cardContainer, { width: "100%" });

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Header animation
        if (progress >= 0.1 && progress <= 0.25) {
          const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
          const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
          const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

          gsap.set(stickyHeader, {
            y: yValue,
            opacity: opacityValue,
          });
        } else if (progress < 0.1) {
          gsap.set(stickyHeader, {
            y: 40,
            opacity: 0,
          });
        } else if (progress > 0.25) {
          gsap.set(stickyHeader, {
            y: 0,
            opacity: 1,
          });
        }

        // Width animation
        if (progress <= 0.25) {
          const widthPercentage = gsap.utils.mapRange(0, 0.25, 100, 75, progress);
          gsap.set(cardContainer, { width: `${widthPercentage}%` });
        } else {
          gsap.set(cardContainer, { width: "75%" });
        }

        // Gap and border radius animation
        if (progress >= 0.35 && !isGapAnimationCompleted) {
          gsap.to(cardContainer, {
            gap: "20px",
            duration: 0.5,
            ease: "power3.out",
          });

          gsap.to([".split-card-1", ".split-card-2", ".split-card-3"], {
            borderRadius: "20px",
            duration: 0.5,
            ease: "power3.out",
          });

          isGapAnimationCompleted = true;
        } else if (progress < 0.35 && isGapAnimationCompleted) {
          gsap.to(cardContainer, {
            gap: "0px",
            duration: 0.5,
            ease: "power3.out",
          });

          gsap.to(".split-card-1", {
            borderRadius: "20px 0 0 20px",
            duration: 0.5,
            ease: "power3.out",
          });

          gsap.to(".split-card-2", {
            borderRadius: "0px",
            duration: 0.5,
            ease: "power3.out",
          });

          gsap.to(".split-card-3", {
            borderRadius: "0 20px 20px 0",
            duration: 0.5,
            ease: "power3.out",
          });

          isGapAnimationCompleted = false;
        }

        // Flip animation
        if (progress >= 0.7 && !isFlipAnimationCompleted) {
          gsap.to(".split-card", {
            rotationY: 180,
            duration: 0.75,
            ease: "power3.inOut",
            stagger: 0.1,
          });

          gsap.to([".split-card-1", ".split-card-3"], {
            y: 30,
            rotationZ: (i) => [-15, 15][i],
            duration: 0.75,
            ease: "power3.inOut",
          });

          isFlipAnimationCompleted = true;
        } else if (progress < 0.7 && isFlipAnimationCompleted) {
          gsap.to(".split-card", {
            rotationY: 0,
            duration: 0.75,
            ease: "power3.inOut",
            stagger: -0.1,
          });

          gsap.to([".split-card-1", ".split-card-3"], {
            y: 0,
            rotationZ: 0,
            duration: 0.75,
            ease: "power3.inOut",
          });

          isFlipAnimationCompleted = false;
        }
      },
    });
  }, { scope: sectionRef });

  return (
    <section className="split-cards-section" ref={sectionRef}>
      <div className="split-sticky-header" ref={stickyHeaderRef}>
        <h1>Exceptional Spaces, Exceptional Design</h1>
      </div>

      <div className="split-card-container" ref={cardContainerRef}>
        <div className="split-card split-card-1">
          <div className="split-card-front">
            <Image src="/spilt_images/01.jpg" alt="Office Space" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="split-card-back split-card-back-1">
            <span>( 01 )</span>
            <p>Premium Office Spaces</p>
          </div>
        </div>

        <div className="split-card split-card-2">
          <div className="split-card-front">
            <Image src="/spilt_images/02.jpg" alt="Modern Design" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="split-card-back split-card-back-2">
            <span>( 02 )</span>
            <p>Modern Architecture</p>
          </div>
        </div>

        <div className="split-card split-card-3">
          <div className="split-card-front">
            <Image src="/spilt_images/03.jpg" alt="Luxury Amenities" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="split-card-back split-card-back-3">
            <span>( 03 )</span>
            <p>Luxury Amenities</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitCards;
