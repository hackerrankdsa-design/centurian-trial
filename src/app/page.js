"use client";
import { useRef, useState, useEffect } from "react";
import Copy from "@/components/Copy/Copy";
import HeroText from "@/components/HeroText/HeroText";
import Preloader from "@/components/Preloader/Preloader";
import CanvasReveal from "@/components/CanvasReveal/CanvasReveal";
import About from "@/components/About/About";
import Spotlight from "@/components/Spotlight/Spotlight";
import Footer from "@/components/Footer/Footer";
import Features from "@/components/Features/Features";
import StickyCards from "@/components/StickyCards/StickyCards";
import SplitCards from "@/components/SplitCards/SplitCards";
import ConstructionProgress from "@/components/ConstructionProgress/ConstructionProgress";
import UnitTypes from "@/components/UnitTypes/UnitTypes";
import FloorPlans from "@/components/FloorPlans/FloorPlans";
import LocationTag from "@/components/LocationTag/LocationTag";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const pageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showHeroContent, setShowHeroContent] = useState(false);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    // Check if video is loaded
    const video = heroVideoRef.current;
    
    if (video) {
      const handleCanPlay = () => {
        console.log("Hero video can play");
        setVideoLoaded(true);
      };

      const handleLoadedData = () => {
        console.log("Hero video data loaded");
        setVideoLoaded(true);
      };

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("loadeddata", handleLoadedData);

      // Check if already loaded
      if (video.readyState >= 3) {
        setVideoLoaded(true);
      }

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, []);

  const handlePreloaderComplete = () => {
    setLoading(false);
    // Show hero content immediately to create merge effect
    setTimeout(() => {
      setShowHeroContent(true);
    }, 200);
  };

  // Separate useEffect for button animation
  useEffect(() => {
    if (!showHeroContent || !pageRef.current) return;

    const heroButtonWrapper = pageRef.current.querySelector(".hero-button-wrapper");
    const heroButtonText = pageRef.current.querySelector(".hero-button-text");

    if (heroButtonWrapper && heroButtonText) {
      const buttonTextContent = heroButtonText.textContent;
      heroButtonText.innerHTML = buttonTextContent
        .split('')
        .map((char) => `<span class="char" style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

      const chars = heroButtonText.querySelectorAll('.char');
      
      gsap.to(heroButtonWrapper, {
        opacity: 1,
        duration: 0.6,
        delay: 1.6,
        ease: "power2.out"
      });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        delay: 1.8,
        ease: "power2.out",
        onStart: () => {
          gsap.set(chars, { y: 20 });
        }
      });
    }
  }, [showHeroContent]);

  useGSAP(() => {
    if (!pageRef.current) return;

    const header = pageRef.current.querySelector(".header h1");
    const textElement3 = pageRef.current.querySelector(".sticky-text-3 .text-container h1");
    const textContainer3 = pageRef.current.querySelector(".sticky-text-3 .text-container");
    const spotlightImages = pageRef.current.querySelector(".spotlight-images");
    const spotlightGridHeader = pageRef.current.querySelector(".spotlight-grid .header");
    const maskContainer = pageRef.current.querySelector(".mask-container");
    const maskImage = pageRef.current.querySelector(".mask-img");
    const maskHeader = pageRef.current.querySelector(".mask-container .header h1");
    const towerVideo = pageRef.current.querySelector(".tower-video");
    const videoTowerSection = pageRef.current.querySelector(".video-tower");

    const outroTextBgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();

    let headerSplit = null;
    if (header) {
      headerSplit = SplitText.create(header, {
        type: "words",
        wordsClass: "spotlight-word",
      });
      gsap.set(headerSplit.words, { opacity: 0 });
    }

    const targetScales = [];

    function calculateDynamicScale() {
      for (let i = 1; i <= 3; i++) {
        const section = pageRef.current.querySelector(`.sticky-text-${i}`);
        const text = pageRef.current.querySelector(`.sticky-text-${i} .text-container h1`);

        if (!section || !text) continue;

        const sectionHeight = section.offsetHeight;
        const textHeight = text.offsetHeight;
        targetScales[i - 1] = sectionHeight / textHeight;
      }
    }

    calculateDynamicScale();
    window.addEventListener("resize", calculateDynamicScale);

    function setScaleY(element, scale) {
      element.style.transform = `scaleY(${scale})`;
    }

    // Sticky text 3 animations
    if (textElement3 && textContainer3) {
      ScrollTrigger.create({
        trigger: ".sticky-text-3",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = targetScales[2] * self.progress;
          setScaleY(textElement3, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-3",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress === 0) {
            textContainer3.style.backgroundColor = outroTextBgColor;
            textContainer3.style.opacity = 1;
          }

          if (progress <= 0.75) {
            const scaleProgress = progress / 0.75;
            const currentScale = 1 + 9 * scaleProgress;
            textContainer3.style.transform = `scale3d(${currentScale}, ${currentScale}, 1)`;
          } else {
            textContainer3.style.transform = `scale3d(10, 10, 1)`;
          }

          if (progress < 0.25) {
            textContainer3.style.backgroundColor = outroTextBgColor;
            textContainer3.style.opacity = 1;
          } else if (progress >= 0.25 && progress <= 0.5) {
            const fadeProgress = (progress - 0.25) / 0.25;
            const bgOpacity = Math.max(0, Math.min(1, 1 - fadeProgress));
            textContainer3.style.backgroundColor = outroTextBgColor.replace("1)", `${bgOpacity})`);
          } else if (progress > 0.5) {
            textContainer3.style.backgroundColor = outroTextBgColor.replace("1)", "0)");
          }

          if (progress >= 0.5 && progress <= 0.75) {
            const textProgress = (progress - 0.5) / 0.25;
            const textOpacity = 1 - textProgress;
            textContainer3.style.opacity = textOpacity;
          } else if (progress > 0.75) {
            textContainer3.style.opacity = 0;
          }

          if (headerSplit && headerSplit.words.length > 0) {
            if (progress >= 0.75 && progress <= 0.95) {
              const textProgress = (progress - 0.75) / 0.2;
              const totalWords = headerSplit.words.length;

              headerSplit.words.forEach((word, index) => {
                const wordRevealProgress = index / totalWords;
                const opacity = textProgress >= wordRevealProgress ? 1 : 0;
                gsap.set(word, { opacity });
              });
            } else if (progress < 0.75) {
              gsap.set(headerSplit.words, { opacity: 0 });
            } else if (progress > 0.95) {
              gsap.set(headerSplit.words, { opacity: 1 });
            }
          }
        },
      });
    }

    // Spotlight grid section animation (inspired by Karim Saab)
    if (spotlightImages && maskContainer) {
      const spotlightContainerHeight = spotlightImages.offsetHeight;
      const viewportHeight = window.innerHeight;
      const initialOffset = spotlightContainerHeight * 0.05;
      const totalMovement = spotlightContainerHeight + initialOffset + viewportHeight;

      let spotlightHeaderSplit = null;
      if (maskHeader) {
        spotlightHeaderSplit = SplitText.create(maskHeader, {
          type: "words",
          wordsClass: "spotlight-word",
        });
        gsap.set(spotlightHeaderSplit.words, { opacity: 0 });
      }

      ScrollTrigger.create({
        trigger: ".spotlight-grid",
        start: "top top",
        end: `+=${window.innerHeight * 7}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Phase 1: Images scroll up (0% - 50%)
          if (progress <= 0.5) {
            const imagesMoveProgress = progress / 0.5;
            const startY = 5;
            const endY = -(totalMovement / spotlightContainerHeight) * 100;
            const currentY = startY + (endY - startY) * imagesMoveProgress;
            gsap.set(spotlightImages, { y: `${currentY}%` });
          }

          // Phase 2: Mask reveals banner (25% - 75%)
          if (maskContainer && maskImage) {
            if (progress >= 0.25 && progress <= 0.75) {
              const maskProgress = (progress - 0.25) / 0.5;
              const maskSize = `${maskProgress * 450}%`;
              const imageScale = 1.5 - maskProgress * 0.5;

              maskContainer.style.setProperty("-webkit-mask-size", maskSize);
              maskContainer.style.setProperty("mask-size", maskSize);
              gsap.set(maskImage, { scale: imageScale });
            } else if (progress < 0.25) {
              maskContainer.style.setProperty("-webkit-mask-size", "0%");
              maskContainer.style.setProperty("mask-size", "0%");
              gsap.set(maskImage, { scale: 1.5 });
            } else if (progress > 0.75) {
              maskContainer.style.setProperty("-webkit-mask-size", "450%");
              maskContainer.style.setProperty("mask-size", "450%");
              gsap.set(maskImage, { scale: 1 });
            }
          }

          // Phase 3: Mask header text reveals (75% - 95%)
          if (spotlightHeaderSplit && spotlightHeaderSplit.words.length > 0) {
            if (progress >= 0.75 && progress <= 0.95) {
              const textProgress = (progress - 0.75) / 0.2;
              const totalWords = spotlightHeaderSplit.words.length;

              spotlightHeaderSplit.words.forEach((word, index) => {
                const wordRevealProgress = index / totalWords;
                if (textProgress >= wordRevealProgress) {
                  gsap.set(word, { opacity: 1 });
                } else {
                  gsap.set(word, { opacity: 0 });
                }
              });
            } else if (progress < 0.75) {
              gsap.set(spotlightHeaderSplit.words, { opacity: 0 });
            } else if (progress > 0.95) {
              gsap.set(spotlightHeaderSplit.words, { opacity: 1 });
            }
          }
        },
      });
    }

    // Video tower scroll animation
    if (towerVideo && videoTowerSection) {
      let videoDuration = 0;
      let isVideoComplete = false;

      towerVideo.load();

      towerVideo.addEventListener("loadedmetadata", () => {
        videoDuration = towerVideo.duration;
        console.log("Video duration loaded:", videoDuration, "seconds");
      });

      towerVideo.addEventListener("loadeddata", () => {
        console.log("Video data loaded and ready for seeking");
      });

      towerVideo.addEventListener("error", (e) => {
        console.error("Video error:", e);
        console.error("Video error code:", towerVideo.error?.code);
        console.error("Video error message:", towerVideo.error?.message);
      });

      const fixedScrollDistance = window.innerHeight * 10;
      console.log("Fixed scroll distance:", fixedScrollDistance, "px (10 viewports)");

      ScrollTrigger.create({
        trigger: ".video-tower",
        start: "top top",
        end: `+=${fixedScrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (towerVideo && videoDuration > 0) {
            const targetTime = progress * videoDuration;

            if (towerVideo.readyState >= 2) {
              towerVideo.currentTime = targetTime;

              const progressPercent = Math.floor(progress * 100);
              if (progressPercent % 10 === 0 && progressPercent !== Math.floor((progress - 0.01) * 100)) {
                console.log(`Progress: ${progressPercent}%, Video time: ${targetTime.toFixed(2)}s / ${videoDuration.toFixed(2)}s`);
              }

              if (targetTime >= videoDuration - 0.05) {
                if (!isVideoComplete) {
                  isVideoComplete = true;
                  console.log("✅ Video playback complete - reached", targetTime.toFixed(2), "of", videoDuration.toFixed(2), "seconds");
                }
              }
            }
          }
        },
        onEnter: () => {
          console.log("📍 Video section entered - pinning started");
          isVideoComplete = false;
          if (towerVideo && videoDuration > 0) {
            towerVideo.currentTime = 0;
          }
        },
        onLeave: () => {
          console.log("⬇️ Video section left - scrolling away");
          isVideoComplete = false;
        },
        onEnterBack: () => {
          console.log("⬆️ Video section re-entered from bottom");
          isVideoComplete = false;
        },
        onLeaveBack: () => {
          console.log("⬆️ Video section left from top");
          isVideoComplete = false;
          if (towerVideo && videoDuration > 0) {
            towerVideo.currentTime = 0;
          }
        },
      });
    }

    return () => {
      window.removeEventListener("resize", calculateDynamicScale);
    };
  }, { scope: pageRef });

  return (
    <>
      {loading && videoLoaded && <Preloader onComplete={handlePreloaderComplete} />}
      
      <div ref={pageRef} style={{ opacity: loading ? 0 : 1, transition: 'opacity 1s ease', backgroundColor: '#091611' }}>
        <nav className="logo-nav">
          <div className="logo-container">
            <Image src="/logo.png" alt="Logo" className="logo-img" width={200} height={200} />
          </div>
        </nav>

        <section className="sticky-text-2">
          <video 
            ref={heroVideoRef}
            className="hero-video" 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="auto"
          >
            <source src="/hero_video_v2.mp4" type="video/mp4" />
          </video>
          {showHeroContent && (
            <div className="hero-content">
              <HeroText delay={0.1} type="chars">
                <h1 className="hero-heading">Capital One JVC</h1>
              </HeroText>
              <HeroText delay={0.6} type="lines">
                <h2 className="hero-subheading">(Centurion Properties)</h2>
              </HeroText>
              <HeroText delay={1} type="lines">
                <p className="hero-description">
                  A landmark commercial tower redefining modern business in the heart of Jumeirah Village Circle. Capital One JVC is built to rule - Discover an extraordinary professional experience blending design, functionality, and luxury to create a workspace that inspires progress and empowers success.
                </p>
              </HeroText>
              <div className="hero-button-wrapper">
                <a href="mailto:inquiry@centuriongroup.ae" className="hero-button">
                  <span className="hero-button-text">Enquire Now</span>
                  <span className="hero-button-arrow">→</span>
                </a>
              </div>
            </div>
          )}
        </section>

        {/* <section className="project-header">
          <div className="project-header-copy">
            <Copy>
              <h2 className="project-header-title">About Capital One JVC</h2>
            </Copy>
            <Copy>
              <p className="project-header-description">
                Building on the success of Capital One Motor City, this next-generation project transforms
                the concept of premium office spaces in Dubai. With its futuristic architecture, smart
                design, and strategic location, Capital One JVC is where innovation meets ambition.
              </p>
            </Copy>
            <div className="project-header-features">
              <Copy>
                <div className="feature-item">
                  <h3>• Innovative Architecture</h3>
                  <p>Futuristic design with efficient, flexible layouts.</p>
                </div>
              </Copy>
              <Copy>
                <div className="feature-item">
                  <h3>• Sustainable Design</h3>
                  <p>Smart, eco-friendly materials ensuring long-term value.</p>
                </div>
              </Copy>
              <Copy>
                <div className="feature-item">
                  <h3>• Urban Connectivity</h3>
                  <p>Strategically positioned near key Dubai landmarks, ensuring convenience and accessibility for every professional.</p>
                </div>
              </Copy>
            </div>
          </div>
        </section> */}

        <About />
        <StickyCards />
        <SplitCards />

        <section className="sticky-text-3">
          <div className="bg-img">
            <Image src="/01.jpg" alt="" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="text-container">
            <h1>Capital One JVC</h1>
          </div>
          {/* <div className="header">
            <Copy>
              <h1>Centurion Properties Project</h1>
            </Copy>
          </div> */}
        </section>

        <section className="spotlight-grid">
          <div className="header">
            <Copy>
              <h1>Futuristic Architecture And Refined Office Spaces</h1>
            </Copy>
          </div>
          <div className="spotlight-images">
          <div className="row">
            <div className="img"></div>
            <div className="img"><Image src="/IMG01.jpg" alt="" fill /></div>
            <div className="img"></div>
            <div className="img"><Image src="/IMG02.jpg" alt="" fill /></div>
          </div>
          <div className="row">
            <div className="img"><Image src="/IMG03.jpg" alt="" fill /></div>
            <div className="img"></div>
            <div className="img"></div>
            <div className="img"></div>
          </div>
          <div className="row">
            <div className="img"></div>
            <div className="img"><Image src="/IMG04.jpg" alt="" fill /></div>
            <div className="img"><Image src="/IMG05.jpg" alt="" fill /></div>
            <div className="img"></div>
          </div>
          <div className="row">
            <div className="img"></div>
            <div className="img"><Image src="/IMG06.jpg" alt="" fill /></div>
            <div className="img"></div>
            <div className="img"><Image src="/IMG07.jpg" alt="" fill /></div>
          </div>
          <div className="row">
            <div className="img"><Image src="/img8.png" alt="" fill /></div>
            <div className="img"></div>
            <div className="img"><Image src="/img9.png" alt="" fill /></div>
            <div className="img"></div>
          </div>
        </div>
        <div className="mask-container">
          <div className="mask-img">
            <Image src="/spotlight-banner.webp" alt="" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="header">
            <h1>Where Excellence Meets Innovation</h1>
          </div>
        </div>
        </section>

        {/* <Features /> */}

        {/* <ConstructionProgress /> */}

        <UnitTypes />

        {/* <section className="video-tower">
          <div className="video-container">
            <video className="tower-video" muted playsInline>
              <source src="/rotating_tower_clipped_1.mp4" type="video/mp4" />
            </video>
          </div>
        </section> */}
        {/* <Spotlight /> */}
        <FloorPlans />
        <LocationTag />
        <Footer />
        {/* <section className="outro">
          <Copy>
            <h1>End of page</h1>
          </Copy>
        </section> */}
      </div>
    </>
  );
}

