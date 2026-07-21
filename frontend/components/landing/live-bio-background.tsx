"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  type: "pollen" | "leaf" | "spore";
  angle: number;
  spinSpeed: number;
  pulse: number;
}

export function LiveBioBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse interactive target across entire window
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Palette: Greenish, Golden Spores, Leafy Teals
    const colors = [
      "rgba(16, 185, 129, ",   // emerald-500
      "rgba(52, 211, 153, ",   // emerald-400
      "rgba(132, 204, 22, ",   // lime-500
      "rgba(234, 179, 8, ",    // golden amber pollen
      "rgba(20, 184, 166, ",   // teal-500
    ];

    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const particles: Particle[] = [];

    function createParticle(initialY?: number): Particle {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const randType = Math.random();
      const type: "pollen" | "leaf" | "spore" =
        randType < 0.6 ? "pollen" : randType < 0.85 ? "spore" : "leaf";

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: type === "leaf" ? Math.random() * 4 + 4 : Math.random() * 2.5 + 1,
        speedY: Math.random() * -0.6 - 0.2, // Move upward slowly
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        color: colorBase,
        type,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.02,
        pulse: Math.random() * Math.PI,
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // Render Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Sunbeam Overlay Light Rays
      const rayGradient = ctx.createLinearGradient(width * 0.7, 0, width * 0.2, height);
      rayGradient.addColorStop(0, "rgba(234, 249, 237, 0.35)");
      rayGradient.addColorStop(0.5, "rgba(16, 185, 129, 0.04)");
      rayGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render & Update Bio Particles
      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.pulse) * 0.3;
        p.angle += p.spinSpeed;
        p.pulse += 0.02;

        // Mouse repelling / floating interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 3;
          p.y -= Math.sin(angle) * force * 3;
        }

        // Reset if out of screen
        if (p.y < -20 || p.x < -20 || p.x > width + 20) {
          particles[idx] = createParticle(height + 10);
        }

        // Render based on particle type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const currentOpacity = Math.min(
          p.opacity,
          (Math.sin(p.pulse) + 1) * 0.35 + 0.2
        );

        if (p.type === "leaf") {
          // Draw small leaf/seed shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity})`;
          ctx.fill();

          // Leaf center line
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        } else if (p.type === "spore") {
          // Glowing spore with radial halo
          const sporeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
          sporeGlow.addColorStop(0, `${p.color}${currentOpacity})`);
          sporeGlow.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = sporeGlow;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft golden/green pollen dot
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${p.color}0.8)`;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Animated Ambient Aurora Gradients */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-lime-200/25 rounded-full blur-3xl animate-pulse-glow style-delay" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[400px] bg-teal-200/20 rounded-full blur-3xl" />

      {/* Interactive Bio Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
