"use client";

import React, { useEffect, useRef, useState } from "react";

interface BreezeLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spinSpeed: number;
  baseSpinSpeed: number;
  color: string;
  opacity: number;
  floatPhaseX: number;
  floatPhaseY: number;
  floatFreqX: number;
  floatFreqY: number;
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

    // Mouse Tracking for Gentle Air Breeze
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouse.lastX !== -1000) {
        mouse.vx = e.clientX - mouse.lastX;
        mouse.vy = e.clientY - mouse.lastY;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.lastX = -1000;
      mouse.lastY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Leaf Color Palette
    const leafColors = [
      "rgba(34, 197, 94, ",   // green-500
      "rgba(16, 185, 129, ",  // emerald-500
      "rgba(132, 204, 22, ",  // lime-500
      "rgba(250, 204, 21, ",  // golden wheat leaf
      "rgba(20, 184, 166, ",  // teal-500
    ];

    // High Density Leaf Count (180 leaves max)
    const leafCount = Math.min(Math.floor((width * height) / 4500), 180);
    const leaves: BreezeLeaf[] = [];

    function createLeaf(): BreezeLeaf {
      const colorBase = leafColors[Math.floor(Math.random() * leafColors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: Math.random() * 8 + 7.5, // Increased leaf size (7.5px to 15.5px)
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.015,
        baseSpinSpeed: (Math.random() - 0.5) * 0.008,
        color: colorBase,
        opacity: Math.random() * 0.45 + 0.3,
        floatPhaseX: Math.random() * Math.PI * 2,
        floatPhaseY: Math.random() * Math.PI * 2,
        floatFreqX: Math.random() * 0.6 + 0.3,
        floatFreqY: Math.random() * 0.6 + 0.3,
      };
    }

    for (let i = 0; i < leafCount; i++) {
      leaves.push(createLeaf());
    }

    // Swaying Grass Blades at Bottom
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
      time += 0.012;
      mouse.vx *= 0.88;
      mouse.vy *= 0.88;
      ctx.clearRect(0, 0, width, height);

      // Render Leaves with Calm Hover Scatter Physics
      leaves.forEach((l) => {
        // 1. Gentle Organic In-Place Floating Wave
        const ambientVx = Math.sin(time * l.floatFreqX + l.floatPhaseX) * 0.25;
        const ambientVy = Math.cos(time * l.floatFreqY + l.floatPhaseY) * 0.2;

        // 2. Calm Mouse Hover Breeze Scatter
        if (mouse.x !== -1000) {
          const dx = l.x - mouse.x;
          const dy = l.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const blowRadius = 180; // Soft breeze radius

          if (dist < blowRadius && dist > 0) {
            const proximityFactor = Math.pow(1 - dist / blowRadius, 1.8);
            const blowForce = proximityFactor * 4.2;

            const dirX = dx / dist;
            const dirY = dy / dist;

            l.vx += dirX * blowForce + mouse.vx * 0.03;
            l.vy += dirY * blowForce + mouse.vy * 0.03;
            l.spinSpeed += (dirX > 0 ? 1 : -1) * proximityFactor * 0.02;
          }
        }

        // Apply Position Updates
        l.x += l.vx + ambientVx;
        l.y += l.vy + ambientVy;
        l.angle += l.spinSpeed + l.baseSpinSpeed;

        // Smooth Damping for Fluid, Calm Motion
        l.vx *= 0.94;
        l.vy *= 0.94;
        l.spinSpeed *= 0.94;

        // Soft Containment inside Screen Edges
        const margin = 25;
        if (l.x < margin) {
          l.x = margin;
          l.vx = Math.abs(l.vx) * 0.5 + 0.3;
        } else if (l.x > width - margin) {
          l.x = width - margin;
          l.vx = -Math.abs(l.vx) * 0.5 - 0.3;
        }

        if (l.y < margin) {
          l.y = margin;
          l.vy = Math.abs(l.vy) * 0.5 + 0.3;
        } else if (l.y > height - margin) {
          l.y = height - margin;
          l.vy = -Math.abs(l.vy) * 0.5 - 0.3;
        }

        // Render Leaf
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);

        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.quadraticCurveTo(l.size, 0, 0, l.size);
        ctx.quadraticCurveTo(-l.size, 0, 0, -l.size);
        ctx.fillStyle = `${l.color}${l.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${l.color}0.55)`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.lineTo(0, l.size);
        ctx.strokeStyle = `rgba(255, 255, 255, ${l.opacity * 0.55})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.restore();
      });

      // Render Swaying Grass Blades at Bottom
      blades.forEach((b) => {
        const naturalSway = Math.sin(time * 2 + b.phase) * 16;
        const dx = mouse.x - b.x;
        const proximity = Math.max(0, 1 - Math.abs(dx) / 160);
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
      {/* Dynamic Ambient Aurora Gradients */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-lime-300/25 rounded-full blur-3xl animate-pulse-glow style-delay" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[400px] bg-teal-300/20 rounded-full blur-3xl" />

      {/* Interactive Breeze Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
