"use client";
import "./About.css";
import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

gsap.registerPlugin(ScrollTrigger);

// Organized gallery images by category
const galleryCategories = {
  exterior: [
    { src: "/IMG01.jpg", title: "Exterior View 1", description: "Capital One JVC - Main Facade", category: "Exterior" },
    { src: "/IMG02.jpg", title: "Exterior View 2", description: "Capital One JVC - Tower View", category: "Exterior" },
    { src: "/IMG03.jpg", title: "Exterior View 3", description: "Capital One JVC - Side Elevation", category: "Exterior" },
    { src: "/IMG04.jpg", title: "Exterior View 4", description: "Capital One JVC - Street View", category: "Exterior" },
    { src: "/IMG05.jpg", title: "Exterior View 5", description: "Capital One JVC - Entrance", category: "Exterior" },
    { src: "/IMG06.jpg", title: "Exterior View 6", description: "Capital One JVC - Full Building", category: "Exterior" },
    { src: "/IMG07.jpg", title: "Exterior View 7", description: "Capital One JVC - Night View", category: "Exterior" },
    { src: "/spotlight-banner.webp", title: "Aerial View", description: "Capital One JVC - Bird's Eye View", category: "Exterior" },
  ],
  reception: [
    { src: "/spotlight/MAIN_RECEPTION.jpg", title: "Main Reception", description: "Elegant lobby entrance", category: "Reception" },
    { src: "/spotlight/OFFICE_RECEPTION.png", title: "Office Reception", description: "Modern office reception area", category: "Reception" },
  ],
  offices: [
    { src: "/spotlight/OFFICE_WORKSTATIONS.png", title: "Office Workstations", description: "Collaborative workspace", category: "Office Spaces" },
    { src: "/spotlight/Light Office_View.jpg", title: "Office View", description: "Bright and spacious office", category: "Office Spaces" },
    { src: "/spotlight/conference_room.jpg", title: "Conference Room", description: "State-of-the-art meeting space", category: "Office Spaces" },
    { src: "/01.jpg", title: "Interior View", description: "Premium office interior", category: "Office Spaces" },
  ],
  podium: [
    { src: "/spotlight/PODIUM_EXTERIOR.jpg", title: "Podium Exterior", description: "Podium level facade", category: "Podium" },
    { src: "/spotlight/UPPER_DECK_PODIUM_01.jpg", title: "Upper Deck Podium", description: "Elevated podium deck", category: "Podium" },
  ],
  amenities: [
    { src: "/spotlight/GYM  2 - HIGH RES.jpg", title: "Gym", description: "Fully equipped fitness center", category: "Amenities" },
    { src: "/spotlight/CANOPY_NIGHT_VIEW.jpg", title: "Canopy Night View", description: "Illuminated canopy entrance", category: "Amenities" },
  ],
};

// Flatten all images for the gallery
const allGalleryImages = Object.values(galleryCategories).flat();

const About = () => {
  useEffect(() => {
    // Initialize FancyBox with error handling
    Fancybox.bind('[data-fancybox="gallery"]', {
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
        preload: 2, // Preload 2 images ahead
      },
      on: {
        error: (fancybox, slide) => {
          console.error('FancyBox image load error:', slide.src);
        },
      },
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  useGSAP(() => {
    const aboutScroll = document.querySelector(".about-scroll");
    const aboutHeader = document.querySelector(".about-header");
    
    // Use a reasonable fixed width for better control
    const scrollWidth = window.innerWidth * 4; // 4x viewport width
    aboutScroll.style.width = `${scrollWidth}px`;
    
    const containerWidth = aboutScroll.offsetWidth;
    const viewportWidth = window.innerWidth;
    
    // Measure the actual header width to ensure we show it completely
    const headerWidth = aboutHeader ? aboutHeader.offsetWidth : viewportWidth * 3;

    const maxTranslateX = containerWidth - viewportWidth;
    const targetProgress = 1;
    const maxTranslateAtTarget = maxTranslateX / targetProgress;
    
    // Calculate how much counter-translation the header needs to be fully visible
    // Header needs to travel (headerWidth - viewportWidth) in the viewport
    // Container travels maxTranslateX, header counter-translates by X
    // Net header movement = maxTranslateX - X should be <= (headerWidth - viewportWidth)
    // So X >= maxTranslateX - (headerWidth - viewportWidth)
    // As a ratio: X/maxTranslateX >= 1 - (headerWidth - viewportWidth)/maxTranslateX
    const headerTravelNeeded = Math.max(0, headerWidth - viewportWidth);
    const counterTranslateRatio = Math.min(0.85, Math.max(0.5, 1 - (headerTravelNeeded / maxTranslateX) + 0.1));

    const images = [
      { id: "#about-img-1", endTranslateX: -800 },
      { id: "#about-img-2", endTranslateX: -1200 },
      { id: "#about-img-3", endTranslateX: -600 },
      { id: "#about-img-4", endTranslateX: -1000 },
      { id: "#about-img-5", endTranslateX: -900 },
    ];

    // Function to recalculate width on resize
    const recalculateWidth = () => {
      const newScrollWidth = window.innerWidth * 4;
      aboutScroll.style.width = `${newScrollWidth}px`;
      ScrollTrigger.refresh();
    };

    // Clip path animation - complete faster so it doesn't consume scroll time
    ScrollTrigger.create({
      trigger: ".about",
      start: "top bottom",
      end: "top 20%", // Complete clip reveal before section is fully in view
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const clipPathValue = Math.min(progress * 100, 100);

        gsap.set(".about-container", {
          clipPath: `circle(${clipPathValue}% at 50% 50%)`,
        });
      },
      onComplete: () => {
        gsap.set(".about-container", {
          clipPath: `circle(100% at 50% 50%)`,
        });
      },
    });

    // Main scroll animation - significantly increased scroll distance
    const scrollDistance = window.innerHeight * 18; // Increased to 18 for much more scroll time
    
    ScrollTrigger.create({
      trigger: ".about",
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        let opacity, scale, translateX;

        // Faster fade-in (10%), longer hold (10-25%), then horizontal scroll
        if (progress <= 0.1) {
          // Fade in phase - quick
          const fadeProgress = progress / 0.1;
          opacity = fadeProgress;
          scale = 0.85 + 0.15 * fadeProgress;
          translateX = 0;
        } else if (progress <= 0.25) {
          // Hold phase - content is fully visible, no horizontal scroll yet
          opacity = 1;
          scale = 1;
          translateX = 0;
        } else {
          // Horizontal scroll phase (75% of total scroll distance)
          opacity = 1;
          scale = 1;
          const adjustedProgress = (progress - 0.25) / (1 - 0.25);
          translateX = -Math.min(
            adjustedProgress * maxTranslateAtTarget,
            maxTranslateX
          );
        }

        gsap.set(aboutScroll, {
          opacity: opacity,
          scale: scale,
          x: translateX,
        });
      },
    });

    // Individual image parallax - starts after hold phase
    images.forEach((img) => {
      ScrollTrigger.create({
        trigger: ".about",
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Start parallax after hold phase (25%)
          if (progress >= 0.25) {
            const adjustedProgress = (progress - 0.25) / (1 - 0.25);
            gsap.set(img.id, {
              x: `${img.endTranslateX * adjustedProgress}px`,
            });
          }
        },
      });
    });

    // Animate header text - fade in, translate with calculated parallax
    ScrollTrigger.create({
      trigger: ".about",
      start: "top top",
      end: `+=${scrollDistance}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        let opacity, scale, headerTranslateX;
        
        // Fade in during first 10% - quick
        if (progress <= 0.1) {
          const fadeProgress = progress / 0.1;
          opacity = fadeProgress;
          scale = 0.85 + 0.15 * fadeProgress;
          headerTranslateX = 0;
        } 
        // Hold phase from 10% to 25% - no horizontal movement
        else if (progress <= 0.25) {
          opacity = 1;
          scale = 1;
          headerTranslateX = 0;
        }
        // Horizontal scroll phase - header counter-translates to stay visible
        else {
          opacity = 1;
          scale = 1;
          const adjustedProgress = (progress <= 0.25 ? progress : (progress - 0.25) / (1 - 0.25));
          // Header counter-translates based on calculated ratio to ensure full visibility
          headerTranslateX = adjustedProgress * maxTranslateX * counterTranslateRatio;
        }
        
        gsap.set(".about-header", {
          opacity: opacity,
          scale: scale,
          x: headerTranslateX,
          yPercent: -50,
        });
      },
    });


    // Add resize listener
    window.addEventListener("resize", recalculateWidth);

    // Cleanup
    return () => {
      window.removeEventListener("resize", recalculateWidth);
    };
  }, []);

  return (
    <section className="about">
      <div className="about-container">
        <div className="about-scroll">
          <div className="about-header">
            <h1>About The Project</h1>
          </div>
          
          <div className="about-content" id="about-content-1">
            <p>
              Building on the success of Capital One Motor City, this next-generation project transforms
              the concept of premium office spaces in Dubai. With its futuristic architecture, smart
              design, and strategic location, Capital One JVC is where innovation meets ambition.
            </p>
          </div>

          <a 
            href="/IMG07.jpg" 
            data-fancybox="gallery" 
            data-caption="<strong>Exterior View 7</strong><br>Capital One JVC - Night View"
            className="about-img" 
            id="about-img-1"
          >
            <img src="/IMG07.jpg" alt="Project Image 1" />
            <div className="about-img-overlay">
              <span className="about-img-icon">🔍</span>
            </div>
          </a>
          
          <a 
            href="/IMG05.jpg" 
            data-fancybox="gallery" 
            data-caption="<strong>Exterior View 5</strong><br>Capital One JVC - Entrance"
            className="about-img" 
            id="about-img-2"
          >
            <img src="/IMG05.jpg" alt="Project Image 2" />
            <div className="about-img-overlay">
              <span className="about-img-icon">🔍</span>
            </div>
          </a>

          <div className="about-content" id="about-content-2">
            <h3>• Innovative Architecture</h3>
            <p>Futuristic design with efficient, flexible layouts.</p>
          </div>

          <a 
            href="/IMG01.jpg" 
            data-fancybox="gallery" 
            data-caption="<strong>Exterior View 1</strong><br>Capital One JVC - Main Facade"
            className="about-img" 
            id="about-img-3"
          >
            <img src="/IMG01.jpg" alt="Project Image 3" />
            <div className="about-img-overlay">
              <span className="about-img-icon">🔍</span>
            </div>
          </a>

          <div className="about-content" id="about-content-3">
            <h3>• Sustainable Design</h3>
            <p>Smart, eco-friendly materials ensuring long-term value.</p>
          </div>
          
          <a 
            href="/IMG03.jpg" 
            data-fancybox="gallery" 
            data-caption="<strong>Exterior View 3</strong><br>Capital One JVC - Side Elevation"
            className="about-img" 
            id="about-img-4"
          >
            <img src="/IMG03.jpg" alt="Project Image 4" />
            <div className="about-img-overlay">
              <span className="about-img-icon">🔍</span>
            </div>
          </a>

          <div className="about-content" id="about-content-4">
            <h3>• Urban Connectivity</h3>
            <p>Strategically positioned near key Dubai landmarks, ensuring convenience and accessibility for every professional.</p>
          </div>
          
          <a 
            href="/spotlight-banner.webp" 
            data-fancybox="gallery" 
            data-caption="<strong>Aerial View</strong><br>Capital One JVC - Bird's Eye View"
            className="about-img" 
            id="about-img-5"
          >
            <img src="/spotlight-banner.webp" alt="Project Image 5" />
            <div className="about-img-overlay">
              <span className="about-img-icon">🔍</span>
            </div>
          </a>

          {/* Hidden images for full gallery */}
          {allGalleryImages.map((img, index) => {
            // Skip images already shown above
            if (['/IMG07.jpg', '/IMG05.jpg', '/IMG01.jpg', '/IMG03.jpg', '/spotlight-banner.webp'].includes(img.src)) {
              return null;
            }
            return (
              <a
                key={index}
                href={img.src}
                data-fancybox="gallery"
                data-caption={`<strong>${img.title}</strong><br>${img.description}<br><em>${img.category}</em>`}
                style={{ display: 'none' }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;

