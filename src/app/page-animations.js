import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const header = document.querySelector(".header h1");
  // const textElement1 = document.querySelector(
  //   ".sticky-text-1 .text-container h1"
  // );
  // const textElement2 = document.querySelector(
  //   ".sticky-text-2 .text-container h1"
  // );
  const textElement3 = document.querySelector(
    ".sticky-text-3 .text-container h1"
  );
  const textContainer3 = document.querySelector(
    ".sticky-text-3 .text-container"
  );

  // Spotlight section elements
  const spotlightImages = document.querySelector(".spotlight-images");
  const maskContainer = document.querySelector(".mask-container");
  const maskImage = document.querySelector(".mask-img");
  const maskHeader = document.querySelector(".mask-container .header h1");

  // Video tower section elements
  const towerVideo = document.querySelector(".tower-video");
  const videoTowerSection = document.querySelector(".video-tower");

  const outroTextBgColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--dark")
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
      const section = document.querySelector(`.sticky-text-${i}`);
      const text = document.querySelector(
        `.sticky-text-${i} .text-container h1`
      );

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

  // ScrollTrigger.create({
  //   trigger: ".sticky-text-1",
  //   start: "top bottom",
  //   end: "top top",
  //   scrub: 1,
  //   onUpdate: (self) => {
  //     const currentScale = targetScales[0] * self.progress;
  //     setScaleY(textElement1, currentScale);
  //   },
  // });

  // ScrollTrigger.create({
  //   trigger: ".sticky-text-1",
  //   start: "top top",
  //   end: `+=${window.innerHeight * 1}px`,
  //   pin: true,
  //   pinSpacing: false,
  //   scrub: 1,
  //   onUpdate: (self) => {
  //     const currentScale = targetScales[0] * (1 - self.progress);
  //     setScaleY(textElement1, currentScale);
  //   },
  // });

  // ScrollTrigger.create({
  //   trigger: ".sticky-text-2",
  //   start: "top bottom",
  //   end: "top top",
  //   scrub: 1,
  //   onUpdate: (self) => {
  //     const currentScale = targetScales[1] * self.progress;
  //     setScaleY(textElement2, currentScale);
  //   },
  // });

  // ScrollTrigger.create({
  //   trigger: ".sticky-text-2",
  //   start: "top top",
  //   end: `+=${window.innerHeight * 1}px`,
  //   pin: true,
  //   pinSpacing: false,
  //   scrub: 1,
  //   onUpdate: (self) => {
  //     const currentScale = targetScales[1] * (1 - self.progress);
  //     setScaleY(textElement2, currentScale);
  //   },
  // });

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
        textContainer3.style.backgroundColor = outroTextBgColor.replace(
          "1)",
          `${bgOpacity})`
        );
      } else if (progress > 0.5) {
        textContainer3.style.backgroundColor = outroTextBgColor.replace(
          "1)",
          "0)"
        );
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

  // Spotlight section animation
  if (spotlightImages && maskContainer) {
    const spotlightContainerHeight = spotlightImages.offsetHeight;
    const viewportHeight = window.innerHeight;
    const initialOffset = spotlightContainerHeight * 0.05;
    const totalMovement =
      spotlightContainerHeight + initialOffset + viewportHeight;

    let spotlightHeaderSplit = null;
    if (maskHeader) {
      spotlightHeaderSplit = SplitText.create(maskHeader, {
        type: "words",
        wordsClass: "spotlight-word",
      });
      gsap.set(spotlightHeaderSplit.words, { opacity: 0 });
    }

    ScrollTrigger.create({
      trigger: ".spotlight",
      start: "top top",
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.5) {
          const imagesMoveProgress = progress / 0.5;

          const startY = 5;
          const endY = -(totalMovement / spotlightContainerHeight) * 100;
          const currentY = startY + (endY - startY) * imagesMoveProgress;

          gsap.set(spotlightImages, {
            y: `${currentY}%`,
          });
        }

        if (maskContainer && maskImage) {
          if (progress >= 0.25 && progress <= 0.75) {
            const maskProgress = (progress - 0.25) / 0.5;
            const maskSize = `${maskProgress * 450}%`;
            const imageScale = 1.5 - maskProgress * 0.5;

            maskContainer.style.setProperty("-webkit-mask-size", maskSize);
            maskContainer.style.setProperty("mask-size", maskSize);

            gsap.set(maskImage, {
              scale: imageScale,
            });
          } else if (progress < 0.25) {
            maskContainer.style.setProperty("-webkit-mask-size", "0%");
            maskContainer.style.setProperty("mask-size", "0%");
            gsap.set(maskImage, {
              scale: 1.5,
            });
          } else if (progress > 0.75) {
            maskContainer.style.setProperty("-webkit-mask-size", "450%");
            maskContainer.style.setProperty("mask-size", "450%");
            gsap.set(maskImage, {
              scale: 1,
            });
          }
        }

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

    // Preload video metadata
    towerVideo.load();
    
    // Wait for video metadata to load
    towerVideo.addEventListener('loadedmetadata', () => {
      videoDuration = towerVideo.duration;
      console.log('Video duration loaded:', videoDuration, 'seconds');
    });

    // Ensure video can be seeked
    towerVideo.addEventListener('loadeddata', () => {
      console.log('Video data loaded and ready for seeking');
    });

    // Handle video errors
    towerVideo.addEventListener('error', (e) => {
      console.error('Video error:', e);
      console.error('Video error code:', towerVideo.error?.code);
      console.error('Video error message:', towerVideo.error?.message);
    });

    // Create ScrollTrigger with fixed large scroll distance
    const fixedScrollDistance = window.innerHeight * 15; // 15 viewports worth
    console.log('Fixed scroll distance:', fixedScrollDistance, 'px (15 viewports)');

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
          // Calculate target video time based on scroll progress
          const targetTime = progress * videoDuration;
          
          // Update video time
          if (towerVideo.readyState >= 2) {
            towerVideo.currentTime = targetTime;
            
            // Log progress at key milestones
            const progressPercent = Math.floor(progress * 100);
            if (progressPercent % 10 === 0 && progressPercent !== Math.floor((progress - 0.01) * 100)) {
              console.log(`Progress: ${progressPercent}%, Video time: ${targetTime.toFixed(2)}s / ${videoDuration.toFixed(2)}s`);
            }
            
            // Check if video is complete
            if (targetTime >= videoDuration - 0.05) {
              if (!isVideoComplete) {
                isVideoComplete = true;
                console.log('✅ Video playback complete - reached', targetTime.toFixed(2), 'of', videoDuration.toFixed(2), 'seconds');
              }
            }
          }
        }
      },
      onEnter: () => {
        console.log('📍 Video section entered - pinning started');
        isVideoComplete = false;
        if (towerVideo && videoDuration > 0) {
          towerVideo.currentTime = 0;
        }
      },
      onLeave: () => {
        console.log('⬇️ Video section left - scrolling away');
        isVideoComplete = false;
      },
      onEnterBack: () => {
        console.log('⬆️ Video section re-entered from bottom');
        isVideoComplete = false;
      },
      onLeaveBack: () => {
        console.log('⬆️ Video section left from top');
        isVideoComplete = false;
        if (towerVideo && videoDuration > 0) {
          towerVideo.currentTime = 0;
        }
      }
    });
  }
});
