"use client";
import "./LocationTag.css";
import Copy from "@/components/Copy/Copy";
import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const LOCATION_URL = "https://maps.app.goo.gl/fzA2J1BWQwxpyNH96";
const EMBED_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4362.365847071392!2d55.21883330000001!3d25.0636389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDAzJzQ5LjEiTiA1NcKwMTMnMDcuOCJF!5e1!3m2!1sen!2sin!4v1774536368059!5m2!1sen!2sin";

gsap.registerPlugin(ScrollTrigger);

export default function LocationTag() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mapWrap = sectionRef.current?.querySelector(".location-map-wrap");
      const cta = sectionRef.current?.querySelector(".location-tag-link");
      if (!mapWrap) return;

      gsap.fromTo(
        mapWrap,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section className="location-tag" ref={sectionRef}>
      <div className="location-tag-inner">
        <Copy>
          <p className="location-tag-kicker">( Location )</p>
        </Copy>

        <Copy>
          <h2 className="location-tag-title">Find Capital One JVC</h2>
        </Copy>

        <div className="location-map-wrap">
          <iframe
            className="location-map"
            src={EMBED_MAP_URL}
            title="Capital One JVC Location Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <a
          className="location-tag-link"
          href={LOCATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Capital One JVC location in Google Maps"
        >
          Open in Google Maps <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
