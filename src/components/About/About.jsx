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
    const isMobile = window.innerWidth <= 768;
    
    // Use a responsive scroll width so mobile finishes naturally
    // Mobile: 3× viewport — fits 9 slots (~4%–85% left) + card width without clipping; desktop unchanged
    const scrollWidth = window.innerWidth * (isMobile ? 3 : 4);
    aboutScroll.style.width = `${scrollWidth}px`;

    const getMaxTranslateX = () =>
      Math.max(0, aboutScroll.offsetWidth - window.innerWidth);

    const getCounterTranslateRatio = (maxTx) => {
      if (!aboutHeader || maxTx <= 0) return 0.85;
      const headerW = aboutHeader.offsetWidth;
      const vw = window.innerWidth;
      const headerTravelNeeded = Math.max(0, headerW - vw);
      return Math.min(0.85, Math.max(0.5, 1 - headerTravelNeeded / maxTx + 0.1));
    };

    /** Mobile: almost no intro — avoid long “dead” scroll before horizontal move. Desktop unchanged. */
    const MOBILE_SCROLL_INTRO = 0.04;
    const desktopFadeEnd = 0.1;
    const desktopHoldEnd = 0.25;

    /** Pin length from live width; desktop keeps ≥ original 18×vh so wide layouts still finish. */
    const getPinnedScrollDistance = () => {
      const mobile = window.innerWidth <= 768;
      const vh = window.innerHeight;
      const maxTx = getMaxTranslateX();
      if (!mobile) {
        const horizontalShare = 1 - desktopHoldEnd;
        return Math.max(
          vh * 18,
          Math.ceil((maxTx * 1.02) / horizontalShare)
        );
      }
      const horizontalShare = 1 - MOBILE_SCROLL_INTRO;
      return Math.max(100, Math.ceil(maxTx / horizontalShare));
    };

    const imageBaseOffsets = [-800, -1200, -600, -1000, -900];
    const imageOffsetMultiplier = isMobile ? 0.45 : 1;
    const images = imageBaseOffsets.map((offset, index) => ({
      id: `#about-img-${index + 1}`,
      endTranslateX: offset * imageOffsetMultiplier,
    }));

    // Function to recalculate width on resize
    const recalculateWidth = () => {
      const mobile = window.innerWidth <= 768;
      const newScrollWidth = window.innerWidth * (mobile ? 3 : 4);
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

    ScrollTrigger.create({
      trigger: ".about",
      start: "top top",
      end: () => `+=${getPinnedScrollDistance()}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxTx = getMaxTranslateX();

        let opacity, scale, translateX;

        if (isMobile) {
          if (progress <= MOBILE_SCROLL_INTRO) {
            const fadeProgress = progress / MOBILE_SCROLL_INTRO;
            opacity = fadeProgress;
            scale = 0.92 + 0.08 * fadeProgress;
            translateX = 0;
          } else {
            opacity = 1;
            scale = 1;
            const adjustedProgress =
              (progress - MOBILE_SCROLL_INTRO) / (1 - MOBILE_SCROLL_INTRO);
            translateX = -Math.min(adjustedProgress * maxTx, maxTx);
          }
        } else if (progress <= desktopFadeEnd) {
          const fadeProgress = progress / desktopFadeEnd;
          opacity = fadeProgress;
          scale = 0.85 + 0.15 * fadeProgress;
          translateX = 0;
        } else if (progress <= desktopHoldEnd) {
          opacity = 1;
          scale = 1;
          translateX = 0;
        } else {
          opacity = 1;
          scale = 1;
          const adjustedProgress =
            (progress - desktopHoldEnd) / (1 - desktopHoldEnd);
          translateX = -Math.min(adjustedProgress * maxTx, maxTx);
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
        end: () => `+=${getPinnedScrollDistance()}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const introEnd = isMobile ? MOBILE_SCROLL_INTRO : desktopHoldEnd;

          if (progress >= introEnd) {
            const adjustedProgress =
              (progress - introEnd) / (1 - introEnd);
            gsap.set(img.id, {
              x: `${img.endTranslateX * adjustedProgress}px`,
            });
          } else {
            gsap.set(img.id, { x: "0px" });
          }
        },
      });
    });

    // Animate header text - fade in, translate with calculated parallax
    ScrollTrigger.create({
      trigger: ".about",
      start: "top top",
      end: () => `+=${getPinnedScrollDistance()}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxTx = getMaxTranslateX();
        const counterRatio = getCounterTranslateRatio(maxTx);

        let opacity, scale, headerTranslateX;

        if (isMobile) {
          if (progress <= MOBILE_SCROLL_INTRO) {
            const fadeProgress = progress / MOBILE_SCROLL_INTRO;
            opacity = fadeProgress;
            scale = 0.92 + 0.08 * fadeProgress;
            headerTranslateX = 0;
          } else {
            opacity = 1;
            scale = 1;
            const adjustedProgress =
              (progress - MOBILE_SCROLL_INTRO) /
              (1 - MOBILE_SCROLL_INTRO);
            headerTranslateX = adjustedProgress * maxTx * counterRatio;
          }
        } else if (progress <= desktopFadeEnd) {
          const fadeProgress = progress / desktopFadeEnd;
          opacity = fadeProgress;
          scale = 0.85 + 0.15 * fadeProgress;
          headerTranslateX = 0;
        } else if (progress <= desktopHoldEnd) {
          opacity = 1;
          scale = 1;
          headerTranslateX = 0;
        } else {
          opacity = 1;
          scale = 1;
          const adjustedProgress =
            (progress - desktopHoldEnd) / (1 - desktopHoldEnd);
          headerTranslateX = adjustedProgress * maxTx * counterRatio;
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
            href="/img9.png" 
            data-fancybox="gallery" 
            data-caption="<strong>Capital One JVC</strong><br>Project imagery"
            className="about-img" 
            id="about-img-1"
          >
            <img src="/img9.png" alt="Project Image 1" />
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
            if (['/img9.png', '/IMG05.jpg', '/IMG01.jpg', '/IMG03.jpg', '/spotlight-banner.webp'].includes(img.src)) {
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

