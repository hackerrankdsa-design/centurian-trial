"use client";
import "./ConstructionProgress.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ConstructionProgress = () => {
  const sectionRef = useRef(null);

  const milestones = [
    {
      title: "Expression of Interest",
      date: "18th June 2025",
      status: "upcoming",
      description: "EOI registration opens for early investors"
    },
    {
      title: "Official Launch",
      date: "18th June 2025",
      status: "upcoming",
      description: "Project officially launches to the market"
    },
    {
      title: "Ground Breaking",
      date: "To Be Announced",
      status: "planned",
      description: "Construction commencement ceremony"
    },
    {
      title: "Estimated Completion",
      date: "End of July 2028",
      status: "planned",
      description: "Project handover and final delivery"
    }
  ];

  const highlights = [
    {
      label: "Payment Plan",
      value: "50/50",
      detail: "On Handover"
    },
    {
      label: "Lobby Height",
      value: "4.55m",
      detail: "Ceiling Height"
    },
    {
      label: "Total Units",
      value: "128",
      detail: "Office & Retail"
    },
    {
      label: "Completion",
      value: "2028",
      detail: "July End"
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const container = section.querySelector(".construction-container");
    const timelineScroll = section.querySelector(".timeline-scroll");
    
    if (!container || !timelineScroll) return;

    // Set initial state - hidden and low z-index
    gsap.set(section, { zIndex: 1, visibility: 'hidden', opacity: 0 });

    const containerWidth = timelineScroll.offsetWidth;
    const viewportWidth = window.innerWidth;
    const maxTranslateX = containerWidth - viewportWidth;

    // Pin the section and create horizontal scroll
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        // Make visible and set high z-index when section is active
        gsap.set(section, { zIndex: 50, visibility: 'visible', opacity: 1 });
      },
      onLeave: () => {
        // Hide and reset z-index when leaving
        gsap.set(section, { zIndex: 1, visibility: 'hidden', opacity: 0 });
      },
      onEnterBack: () => {
        // Make visible and set high z-index when scrolling back
        gsap.set(section, { zIndex: 50, visibility: 'visible', opacity: 1 });
      },
      onLeaveBack: () => {
        // Hide and reset z-index when leaving from top
        gsap.set(section, { zIndex: 1, visibility: 'hidden', opacity: 0 });
      },
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Fade in effect at the beginning
        let opacity, translateX;
        
        if (progress <= 0.1) {
          const fadeProgress = progress / 0.1;
          opacity = fadeProgress;
          translateX = 0;
        } else {
          opacity = 1;
          const adjustedProgress = (progress - 0.1) / (1 - 0.1);
          translateX = -Math.min(adjustedProgress * maxTranslateX, maxTranslateX);
        }

        gsap.set(timelineScroll, {
          opacity: opacity,
          x: translateX,
        });
      },
    });

    // Refresh ScrollTrigger after a short delay to ensure correct positioning
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Highlight milestones one by one as they come into view
    const milestones = section.querySelectorAll(".milestone-item");
    milestones.forEach((milestone, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const adjustedProgress = (progress - 0.1) / (1 - 0.1);
          
          // Calculate when this milestone should be highlighted
          const milestoneProgress = index / (milestones.length - 1);
          const highlightStart = Math.max(0, milestoneProgress - 0.15);
          const highlightEnd = Math.min(1, milestoneProgress + 0.15);
          
          if (adjustedProgress >= highlightStart && adjustedProgress <= highlightEnd) {
            const highlightIntensity = 1 - Math.abs(adjustedProgress - milestoneProgress) / 0.15;
            gsap.set(milestone, {
              scale: 0.95 + (0.05 * highlightIntensity),
              opacity: 0.6 + (0.4 * highlightIntensity),
            });
          } else if (adjustedProgress > highlightEnd) {
            gsap.set(milestone, {
              scale: 0.95,
              opacity: 0.6,
            });
          } else {
            gsap.set(milestone, {
              scale: 0.95,
              opacity: 0.4,
            });
          }
        },
      });
    });

  }, { scope: sectionRef });

  return (
    <section className="construction-progress" ref={sectionRef}>
      <div className="construction-container">
        <div className="timeline-scroll">
          <div className="construction-header">
            <h1 className="construction-title">Construction Timeline</h1>
            <p className="construction-subtitle">Key Milestones & Project Progress</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`milestone-item milestone-${milestone.status}`}>
                <div className="milestone-dot"></div>
                <div className="milestone-content">
                  <span className="milestone-status">{milestone.status}</span>
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-date">{milestone.date}</p>
                  <p className="milestone-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="highlights-grid">
            {highlights.map((highlight, index) => (
              <div key={index} className="highlight-card">
                <div className="highlight-value">{highlight.value}</div>
                <div className="highlight-label">{highlight.label}</div>
                <div className="highlight-detail">{highlight.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionProgress;

