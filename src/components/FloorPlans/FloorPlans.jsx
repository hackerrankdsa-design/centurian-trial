"use client";
import "./FloorPlans.css";
import Image from "next/image";
import Copy from "@/components/Copy/Copy";
import { useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FLOOR_PLAN_IMAGES } from "@/data/floorPlans";

gsap.registerPlugin(ScrollTrigger);

function encodePublicPath(path) {
  return encodeURI(path);
}

function captionFromPath(path) {
  const m = path.match(/\/([^/]+)\/0\.jpg$/);
  return m ? m[1] : "Floor plan";
}

function getPreviewIndices() {
  const n = FLOOR_PLAN_IMAGES.length;
  if (n <= 4) return [...Array(n).keys()];
  return [0, Math.floor(n / 4), Math.floor(n / 2), n - 1];
}

const PREVIEW_INDICES = getPreviewIndices();

export default function FloorPlans() {
  const sectionRef = useRef(null);

  const slides = useMemo(
    () =>
      FLOOR_PLAN_IMAGES.map((src) => ({
        src: encodePublicPath(src),
        type: "image",
        thumb: encodePublicPath(src),
        caption: captionFromPath(src),
      })),
    []
  );

  const openGallery = useCallback((startIndex) => {
    Fancybox.show(slides, {
      closeExisting: true,
      Thumbs: {
        autoStart: true,
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["slideshow", "thumbs", "close"],
        },
      },
      Images: {
        zoom: true,
        protected: true,
      },
      Carousel: {
        infinite: true,
        preload: 2,
        initialPage: startIndex,
      },
      on: {
        error: (_api, slide) => {
          console.error("Floor plan image load error:", slide?.src);
        },
      },
    });
  }, [slides]);

  useGSAP(
    () => {
      const cards = sectionRef.current?.querySelectorAll(".floor-plans-card");
      const btn = sectionRef.current?.querySelector(".floor-plans-view-all");
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );

      if (btn) {
        gsap.fromTo(
          btn,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section className="floor-plans" ref={sectionRef}>
      <div className="floor-plans-inner">
        <Copy>
          <p className="floor-plans-kicker">( Floor Plans )</p>
        </Copy>

        <Copy>
          <h2 className="floor-plans-title">Explore layouts & unit types</h2>
        </Copy>

        <div className="floor-plans-grid">
          {PREVIEW_INDICES.map((globalIndex) => {
            const src = FLOOR_PLAN_IMAGES[globalIndex];
            const enc = encodePublicPath(src);
            const label = captionFromPath(src);
            return (
              <button
                type="button"
                key={globalIndex}
                className="floor-plans-card"
                onClick={() => openGallery(globalIndex)}
                aria-label={`Open floor plan gallery (${label})`}
              >
                <div className="floor-plans-card-image">
                  <Image
                    src={enc}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="floor-plans-view-all"
          onClick={() => openGallery(0)}
        >
          View all floor plans
        </button>
      </div>
    </section>
  );
}
