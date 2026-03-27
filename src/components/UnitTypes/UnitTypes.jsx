"use client";
import "./UnitTypes.css";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const UnitTypes = () => {
  const sectionRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const unitTypes = [
    {
      type: "Office",
      count: "91 Units",
      sizeRange: "870 - 1,370",
      unit: "sq ft",
      color: "#c9a961"
    },
    {
      type: "Office with Terrace",
      count: "34 Units",
      sizeRange: "1,165 - 3,110",
      unit: "sq ft",
      color: "#d4af37"
    },
    {
      type: "Retail",
      count: "3 Units",
      sizeRange: "720 - 4,210",
      unit: "sq ft",
      color: "#b8962e"
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const title = section.querySelector(".unit-types-title");
    const subtitle = section.querySelector(".unit-types-subtitle");
    const statsSection = section.querySelector(".unit-stats");
    const statNumbers = section.querySelectorAll(".stat-number");
    const unitCards = section.querySelectorAll(".unit-card");
    const paymentInfo = section.querySelector(".payment-info");

    // Kill existing ScrollTrigger if any
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    // On mobile, show everything without animation
    if (isMobile) {
      gsap.set([title, subtitle, statsSection, unitCards, paymentInfo], { 
        clearProps: "all" 
      });
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"));
        stat.textContent = target;
      });
      return;
    }

    // Configure ScrollTrigger globally
    ScrollTrigger.config({ 
      ignoreMobileResize: true 
    });

    // Set initial states - use autoAlpha for proper visibility control
    gsap.set(title, { y: 30, autoAlpha: 0 });
    gsap.set(subtitle, { y: 20, autoAlpha: 0 });
    gsap.set(statsSection, { y: 25, autoAlpha: 0 });
    gsap.set(unitCards, { y: 30, autoAlpha: 0 });
    gsap.set(paymentInfo, { y: 20, autoAlpha: 0 });

    // Shorter scroll distance for faster animation
    const viewportHeight = window.innerHeight;
    const totalScrollDistance = viewportHeight * 3;

    // Main ScrollTrigger with pinning
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${totalScrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.set(section, { zIndex: 50 });
      },
      onLeave: () => {
        gsap.set(section, { zIndex: 20 });
      },
      onEnterBack: () => {
        gsap.set(section, { zIndex: 50 });
      },
      onLeaveBack: () => {
        gsap.set(section, { zIndex: 20 });
      },
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Phase 1: Everything animates in quickly (0% - 40%)
        if (progress <= 0.4) {
          const phaseProgress = progress / 0.4;
          
          // Title - starts immediately
          const titleProgress = Math.min(1, phaseProgress * 3);
          gsap.set(title, { 
            y: 30 - (30 * titleProgress), 
            autoAlpha: titleProgress 
          });
          
          // Subtitle - slight delay
          const subtitleProgress = Math.max(0, Math.min(1, (phaseProgress - 0.1) * 3));
          gsap.set(subtitle, { 
            y: 20 - (20 * subtitleProgress), 
            autoAlpha: subtitleProgress 
          });
          
          // Stats - follows
          const statsProgress = Math.max(0, Math.min(1, (phaseProgress - 0.15) * 3));
          gsap.set(statsSection, { 
            y: 25 - (25 * statsProgress), 
            autoAlpha: statsProgress 
          });
          
          // Animate stat numbers
          if (statsProgress > 0) {
            statNumbers.forEach((stat) => {
              const target = parseInt(stat.getAttribute("data-target"));
              const currentValue = Math.ceil(target * statsProgress);
              stat.textContent = currentValue;
            });
          }
          
          // Cards - all together with slight stagger
          unitCards.forEach((card, index) => {
            const cardDelay = 0.2 + (index * 0.05);
            const cardProgress = Math.max(0, Math.min(1, (phaseProgress - cardDelay) * 4));
            gsap.set(card, { 
              y: 30 - (30 * cardProgress), 
              autoAlpha: cardProgress
            });
          });
          
          // Payment - last
          const paymentProgress = Math.max(0, Math.min(1, (phaseProgress - 0.35) * 4));
          gsap.set(paymentInfo, { 
            y: 20 - (20 * paymentProgress), 
            autoAlpha: paymentProgress
          });
          
        } else {
          // Keep everything fully visible
          gsap.set(title, { y: 0, autoAlpha: 1 });
          gsap.set(subtitle, { y: 0, autoAlpha: 1 });
          gsap.set(statsSection, { y: 0, autoAlpha: 1 });
          gsap.set(unitCards, { y: 0, autoAlpha: 1 });
          gsap.set(paymentInfo, { y: 0, autoAlpha: 1 });
          
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            stat.textContent = target;
          });
        }
        
        // Phase 2: Hold everything visible (40% - 100%)
        // Content stays fully visible during this phase
      }
    });

    // Refresh ScrollTrigger after setup
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, { scope: sectionRef, dependencies: [isMobile] });

  return (
    <section className="unit-types" ref={sectionRef}>
      <div className="unit-types-container">
        <div className="unit-types-header">
          <h1 className="unit-types-title">Unit Types & Sizes</h1>
          <p className="unit-types-subtitle">Choose Your Perfect Space</p>
        </div>

        <div className="unit-stats">
          <div className="stat-item">
            <div className="stat-number" data-target="128">0</div>
            <div className="stat-label">Total Units</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="91">0</div>
            <div className="stat-label">Office Units</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="34">0</div>
            <div className="stat-label">Terrace Units</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="3">0</div>
            <div className="stat-label">Retail Units</div>
          </div>
        </div>

        <div className="unit-cards-grid">
          {unitTypes.map((unit, index) => (
            <div key={index} className="unit-card" style={{ "--accent-color": unit.color }}>
              <div className="unit-card-header">
                <div className="unit-type-badge">{unit.type}</div>
                <div className="unit-count">{unit.count}</div>
              </div>

              <div className="unit-size">
                <div className="size-range">{unit.sizeRange}</div>
                <div className="size-unit">{unit.unit}</div>
              </div>

              <div className="unit-card-footer">
                <a href="mailto:inquiry@centuriongroup.ae" className="unit-enquire-btn">
                  Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="payment-info">
          <div className="payment-card">
            <div className="payment-icon">💳</div>
            <h3>Payment Plan</h3>
            <div className="payment-plan">50/50</div>
            <p>50% Construction • 50% Handover</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnitTypes;

