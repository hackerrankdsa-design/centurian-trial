"use client";
import "./CanvasReveal.css";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function CanvasReveal({ cards = [] }) {
  const sectionRef = useRef(null);
  const outlineCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const cardsRef = useRef(null);
  const triangleStatesRef = useRef(new Map());
  const animationFrameIdRef = useRef(null);
  const canvasXPositionRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current || !outlineCanvasRef.current || !fillCanvasRef.current) return;

    const stickySection = sectionRef.current;
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const outlineCtx = outlineCanvas.getContext("2d");
    const fillCtx = fillCanvas.getContext("2d");

    const triangleSize = 150;
    const lineWidth = 1;
    const SCALE_THRESHOLD = 0.01;

    function setCanvasSize(canvas, ctx) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    }

    function drawTriangle(ctx, x, y, fillScale = 0, flipped = false) {
      const halfSize = triangleSize / 2;

      if (fillScale < SCALE_THRESHOLD) {
        ctx.beginPath();
        if (!flipped) {
          ctx.moveTo(x, y - halfSize);
          ctx.lineTo(x + halfSize, y + halfSize);
          ctx.lineTo(x - halfSize, y + halfSize);
        } else {
          ctx.moveTo(x, y + halfSize);
          ctx.lineTo(x + halfSize, y - halfSize);
          ctx.lineTo(x - halfSize, y - halfSize);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.075)";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      if (fillScale >= SCALE_THRESHOLD) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(fillScale, fillScale);
        ctx.translate(-x, -y);

        ctx.beginPath();
        if (!flipped) {
          ctx.moveTo(x, y - halfSize);
          ctx.lineTo(x + halfSize, y + halfSize);
          ctx.lineTo(x - halfSize, y + halfSize);
        } else {
          ctx.moveTo(x, y + halfSize);
          ctx.lineTo(x + halfSize, y - halfSize);
          ctx.lineTo(x - halfSize, y - halfSize);
        }
        ctx.closePath();
        ctx.fillStyle = "#c9a961";
        ctx.strokeStyle = "#c9a961";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }
    }

    function drawGrid(scrollProgress = 0) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
      fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

      const animationProgress =
        scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;

      let needsUpdate = false;
      const animationSpeed = 0.15;

      triangleStatesRef.current.forEach((state) => {
        if (state.scale < 1) {
          const x =
            state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPositionRef.current;
          const y = state.row * triangleSize + triangleSize / 2;
          const flipped = (state.row + state.col) % 2 !== 0;
          drawTriangle(outlineCtx, x, y, 0, flipped);
        }
      });

      triangleStatesRef.current.forEach((state) => {
        const shouldBeVisible = state.order <= animationProgress;
        const targetScale = shouldBeVisible ? 1 : 0;
        const newScale =
          state.scale + (targetScale - state.scale) * animationSpeed;

        if (Math.abs(newScale - state.scale) > 0.001) {
          state.scale = newScale;
          needsUpdate = true;
        }

        if (state.scale >= SCALE_THRESHOLD) {
          const x =
            state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPositionRef.current;
          const y = state.row * triangleSize + triangleSize / 2;
          const flipped = (state.row + state.col) % 2 !== 0;
          drawTriangle(fillCtx, x, y, state.scale, flipped);
        }
      });

      if (needsUpdate) {
        animationFrameIdRef.current = requestAnimationFrame(() => drawGrid(scrollProgress));
      }
    }

    function initializeTriangles() {
      const cols = Math.ceil(window.innerWidth / (triangleSize * 0.5));
      const rows = Math.ceil(window.innerHeight / (triangleSize * 0.5));
      const totalTriangles = rows * cols;

      const positions = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          positions.push({ row: r, col: c, key: `${r}-${c}` });
        }
      }

      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      positions.forEach((pos, index) => {
        triangleStatesRef.current.set(pos.key, {
          order: index / totalTriangles,
          scale: 0,
          row: pos.row,
          col: pos.col,
        });
      });
    }

    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);
    initializeTriangles();
    drawGrid();

    const handleResize = () => {
      setCanvasSize(outlineCanvas, outlineCtx);
      setCanvasSize(fillCanvas, fillCtx);
      triangleStatesRef.current.clear();
      initializeTriangles();
      drawGrid();
    };

    window.addEventListener("resize", handleResize);

    const stickyHeight = window.innerHeight * 5;

    const scrollTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: false,
      scrub: 1,
      onUpdate: (self) => {
        canvasXPositionRef.current = -self.progress * 200;
        drawGrid(self.progress);

        if (cardsRef.current) {
          const progress = Math.min(self.progress / 0.654, 1);
          gsap.set(cardsRef.current, {
            x: -progress * window.innerWidth * 2,
          });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTrigger.kill();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="canvas-reveal-section">
      <div className="canvas-bg-img">
        <Image src="/spotlight-banner.webp" alt="" fill style={{ objectFit: 'cover' }} />
      </div>

      <canvas ref={outlineCanvasRef} className="outline-layer"></canvas>

      <div ref={cardsRef} className="canvas-cards">
        {cards.map((card, index) => (
          <div key={index} className="canvas-card">
            <div className="canvas-card-img">
              <Image src={card.image} alt={card.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="canvas-card-title">
              <h2>{card.title}</h2>
              <p>{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <canvas ref={fillCanvasRef} className="fill-layer"></canvas>
    </section>
  );
}

