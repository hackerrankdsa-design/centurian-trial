"use client";
import "./StickyCards.css";

import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const StickyCards = () => {
  const stickyCardsData = [
    {
      index: "01",
      title: "Indoor Seating Area",
      image: "/04.jpg",
      description:
        "State-of-the-art seating area designed for modern businesses.",
    },
    {
      index: "02",
      title: "Leisure Area",
      image: "/IMG06.jpg",
      description:
        "World-class facilities and recreational areas. Every amenity crafted to enhance your work-life balance.",
    },
    {
      index: "03",
      title: "Retail Area",
      image: "/spotlight/CANOPY_NIGHT_VIEW.jpg",
      description:
        "Premium retail spaces offering strong visibility and steady footfall within a thriving community. Strategically connected to major landmarks, business districts, and transportation networks for maximum accessibility and growth potential.",
    },
    {
      index: "04",
      title: "Offices",
      image: "/spotlight/Light Office_View09.png",
      description:
        "Designed with a futuristic architectural concept, Capital One JVC creates a seamless, technology-driven work environment that inspires productivity, collaboration, and growth.",
    },
  ];

  const container = useRef(null);

  useGSAP(
    () => {
      const root = container.current;
      if (!root) return;
      const stickyCards = root.querySelectorAll(".sticky-card");

      stickyCards.forEach((card, index) => {
        if (index < stickyCards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: stickyCards[stickyCards.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
        }

        if (index < stickyCards.length - 1) {
          ScrollTrigger.create({
            trigger: stickyCards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              const scale = 1 - progress * 0.25;
              const rotation = (index % 2 === 0 ? 5 : -5) * progress;
              const afterOpacity = progress;

              gsap.set(card, {
                scale: scale,
                rotation: rotation,
                "--after-opacity": afterOpacity,
              });
            },
          });
        }
      });
    },
    { scope: container }
  );

  return (
    <div className="sticky-cards" ref={container}>
      {stickyCardsData.map((cardData, index) => (
        <div className="sticky-card" key={index}>
          <div className="sticky-card-index">
            <h1>{cardData.index}</h1>
          </div>
          <div className="sticky-card-content">
            <div className="sticky-card-content-wrapper">
              <h1 className="sticky-card-header">{cardData.title}</h1>

              <div className="sticky-card-img">
                <img src={cardData.image} alt={cardData.title} />
              </div>

              <div className="sticky-card-copy">
                <div className="sticky-card-copy-title">
                  <p>(About the feature)</p>
                </div>
                <div className="sticky-card-copy-description">
                  <p>{cardData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StickyCards;

