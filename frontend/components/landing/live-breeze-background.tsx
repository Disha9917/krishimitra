"use client";

import React, { useEffect, useRef, useState } from "react";

interface BreezeLeaf {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spinSpeed: number;
  color: string;
  opacity: number;
}

interface GrassBlade {
  x: number;
  height: number;
  width: number;
  bend: number;
  swaySpeed: number;
  phase: number;
  color: string;
}

export function LiveBreezeBackground() {
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
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse wind turbulence tracking
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      lastX: -1000,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouse.lastX !== -1000) {
        mouse.vx = (e.clientX - mouse.lastX) * 0.15;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.lastX = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // 1. Generate Floating Leaves & Spores
    const leafColors = [
      "rgba(34, 197, 94, ",   // green-500
      "rgba(16, 185, 129, ",  // emerald-500
      "rgba(132, 204, 22, ",  // lime-500
      "rgba(250, 204, 21, ",  // golden wheat leaf
      "rgba(20, 184, 166, ",  // teal-500
    ];

    const leafCount = Math.min(Math.floor((width * height) / 16000), 50);
    const leaves: BreezeLeaf[] = [];

    function createLeaf(startX?: number): BreezeLeaf {
      const colorBase = leafColors[Math.floor(Math.random() * leafColors.length)];
      return {
        x: startX !== undefined ? startX : Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 4,
        speedX: Math.random() * 1.5 + 0.8, // Breeze moving left to right
        speedY: (Math.random() - 0.3) * 0.4,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.04,
        color: colorBase,
        opacity: Math.random() * 0.5 + 0.3,
      };
    }

    for (let i = 0; i < leafCount; i++) {
      leaves.push(createLeaf());
    }

    // 2. Generate Swaying Grass / Wheat Blade Silhouettes at Bottom
    const bladeCount = Math.floor(width / 12);
    const blades: GrassBlade[] = [];
    const grassColors = [
      "rgba(16, 185, 129, 0.45)",
      "rgba(34, 197, 94, 0.4)",
      "rgba(132, 204, 22, 0.35)",
      "rgba(5, 150, 105, 0.5)",
    ];

    for (let i = 0; i < bladeCount; i++) {
      blades.push({
        x: i * 12 + (Math.random() - 0.5) * 6,
        height: Math.random() * 70 + 40,
        width: Math.random() * 4 + 3,
        bend: 0,
        swaySpeed: Math.random() * 0.02 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: grassColors[Math.floor(Math.random() * grassColors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      mouse.vx *= 0.95; // Decay mouse wind impulse
      ctx.clearRect(0, 0, width, height);

      // 1. Render Floating Breeze Leaves
      leaves.forEach((l, idx) => {
        // Wind speed modulation + mouse gust
        const windBoost = Math.max(0, mouse.vx);
        l.x += l.speedX + windBoost;
        l.y += l.speedY + Math.sin(time + l.angle) * 0.4;
        l.angle += l.spinSpeed + windBoost * 0.02;

        // Reset when moving off screen right
        if (l.x > width + 20) {
          leaves[idx] = createLeaf(-20);
        }

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);

        // Draw detailed leaf silhouette
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.quadraticCurveTo(l.size, 0, 0, l.size);
        ctx.quadraticCurveTo(-l.size, 0, 0, -l.size);
        ctx.fillStyle = `${l.color}${l.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `${l.color}0.6)`;
        ctx.fill();

        // Leaf stem line
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.lineTo(0, l.size);
        ctx.strokeStyle = `rgba(255, 255, 255, ${l.opacity * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      });

      // 2. Render Swaying Grass Blades at the Viewport Bottom
      blades.forEach((b) => {
        const naturalSway = Math.sin(time * 2 + b.phase) * 18;
        // Mouse proximity wind bend
        const dx = mouse.x - b.x;
        const proximity = Math.max(0, 1 - Math.abs(dx) / 150);
        const mouseBend = proximity * (mouse.vx || (dx < 0 ? 15 : -15));

        const tipX = b.x + naturalSway + mouseBend;
        const tipY = height - b.height;

        ctx.beginPath();
        ctx.moveTo(b.x - b.width / 2, height);
        ctx.quadraticCurveTo(
          b.x + naturalSway * 0.5,
          height - b.height * 0.6,
          tipX,
          tipY
        );
        ctx.quadraticCurveTo(
          b.x + naturalSway * 0.5 + b.width / 2,
          height - b.height * 0.6,
          b.x + b.width / 2,
          height
        );
        ctx.fillStyle = b.color;
        ctx.fill();
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
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-lime-300/25 rounded-full blur-3xl animate-pulse-glow style-delay" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[400px] bg-teal-300/20 rounded-full blur-3xl" />

      {/* Interactive Breeze Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
