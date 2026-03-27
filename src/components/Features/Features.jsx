"use client";
import "./Features.css";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const videoRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const video = videoRef.current;

    if (!section || !inner) return;

    // Calculate the total scroll distance
    const blocks = inner.querySelectorAll(".features__block");
    if (blocks.length === 0) return;

    const totalWidth = Array.from(blocks).reduce((acc, block) => acc + block.offsetWidth, 0);
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    // Set initial states for all animated elements
    blocks.forEach((block) => {
      const title = block.querySelector(".features__title");
      const subtitle = block.querySelector(".features__subtitle");
      const items = block.querySelectorAll(".features__item");

      if (title) gsap.set(title, { opacity: 0, y: 50 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 30 });
      items.forEach((item) => gsap.set(item, { opacity: 0, x: -30 }));
    });

    // Main horizontal scroll animation
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${scrollDistance + window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const translateX = -progress * scrollDistance;
        
        gsap.set(inner, {
          x: translateX,
        });

        // Animate blocks based on their position
        blocks.forEach((block, index) => {
          const blockProgress = Math.max(0, Math.min(1, (progress - (index * 0.25)) / 0.25));
          
          const title = block.querySelector(".features__title");
          const subtitle = block.querySelector(".features__subtitle");
          const items = block.querySelectorAll(".features__item");

          if (title) {
            gsap.set(title, {
              opacity: blockProgress,
              y: 50 - (blockProgress * 50),
            });
          }

          if (subtitle) {
            gsap.set(subtitle, {
              opacity: blockProgress,
              y: 30 - (blockProgress * 30),
            });
          }

          items.forEach((item, i) => {
            const itemDelay = i * 0.1;
            const itemProgress = Math.max(0, Math.min(1, blockProgress - itemDelay));
            gsap.set(item, {
              opacity: itemProgress,
              x: -30 + (itemProgress * 30),
            });
          });
        });

        // Play video when in view
        if (video && progress > 0.1 && progress < 0.9) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else if (video) {
          video.pause();
        }
      },
    });

  }, { scope: sectionRef });

  return (
    <section className="features" ref={sectionRef}>
      <div className="features__sticky">
        <div className="features__inner" ref={innerRef}>
          
          {/* Video Block */}
          {/* <div className="features__media">
            <div className="features__media-sticky">
              <div className="features__media-inner">
                <div className="features__video-bg"></div>
                <video
                  ref={videoRef}
                  className="features__video"
                  src="/rotating_tower.mp4"
                  playsInline
                  muted
                  loop
                />
              </div>
            </div>
          </div> */}

          {/* Feature Block 1 - Amenities */}
          <div className="features__block">
            <div className="features__content">
              <div className="features__title">
                <h2>Premium Amenities</h2>
              </div>
              <div className="features__subtitle">
                <p>
                  Experience world-class facilities designed for modern professionals.
                  Every amenity is crafted to enhance your work-life balance.
                </p>
              </div>
              <div className="features__list">
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/GYM  2 - HIGH RES.jpg" alt="Gym" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>State-of-the-Art Gym</h3>
                    <p>Fully equipped fitness center with modern equipment</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/conference_room.jpg" alt="Conference" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Conference Rooms</h3>
                    <p>Professional meeting spaces with latest technology</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/CANOPY_NIGHT_VIEW.jpg" alt="Canopy" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Outdoor Spaces</h3>
                    <p>Beautiful canopy areas for relaxation and networking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Block 2 - Office Spaces */}
          <div className="features__block">
            <div className="features__content">
              <div className="features__title">
                <h2>Modern Workspaces</h2>
              </div>
              <div className="features__subtitle">
                <p>
                  Flexible office solutions that adapt to your business needs.
                  From private offices to collaborative spaces, we have it all.
                </p>
              </div>
              <div className="features__list">
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/OFFICE_WORKSTATIONS.png" alt="Workstations" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Flexible Workstations</h3>
                    <p>Collaborative open spaces with ergonomic design</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/Light Office_View.jpg" alt="Office" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Private Offices</h3>
                    <p>Bright, spacious offices with natural lighting</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/OFFICE_RECEPTION.png" alt="Reception" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Professional Reception</h3>
                    <p>Impressive entrance to welcome your clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Block 3 - Location */}
          <div className="features__block">
            <div className="features__content">
              <div className="features__title">
                <h2>Prime Location</h2>
              </div>
              <div className="features__subtitle">
                <p>
                  Strategically positioned in JVC, offering easy access to key
                  business districts and lifestyle destinations across Dubai.
                </p>
              </div>
              <div className="features__list">
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/PODIUM_EXTERIOR.jpg" alt="Podium" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Accessible Podium</h3>
                    <p>Multiple entry points with ample parking</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/UPPER_DECK_PODIUM_01.jpg" alt="Upper Deck" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Upper Deck Views</h3>
                    <p>Panoramic views of Dubai's skyline</p>
                  </div>
                </div>
                <div className="features__item">
                  <div className="features__item-icon">
                    <Image src="/spotlight/MAIN_RECEPTION.jpg" alt="Main Reception" width={80} height={80} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="features__item-text">
                    <h3>Grand Entrance</h3>
                    <p>Elegant main reception with 24/7 concierge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;

