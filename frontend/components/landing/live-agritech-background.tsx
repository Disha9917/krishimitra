"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulse: number;
  pulseSpeed: number;
}

export function LiveAgriTechBackground() {
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

    // Mouse interactive radar target
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
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

    // AgriTech Field Grid Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 16000), 55);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    let time = 0;
    let radarAngle = 0;

    const render = () => {
      time += 0.012;
      radarAngle += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Topographic Terrain Contour Waves
      const waveCount = 5;
      ctx.lineWidth = 1;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const yOffset = (height / (waveCount + 1)) * (w + 1);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.04 + w * 0.015})`;

        for (let x = 0; x < width; x += 15) {
          const wave1 = Math.sin(x * 0.003 + time + w) * 35;
          const wave2 = Math.cos(x * 0.006 - time * 0.8) * 20;
          const y = yOffset + wave1 + wave2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 2. Rotating Radar Scanning Line (Top-Right Center Anchor)
      const radarCenterX = width * 0.8;
      const radarCenterY = height * 0.25;
      const radarRadius = Math.max(width, height) * 0.6;

      const radarGrad = ctx.createConicGradient(radarAngle, radarCenterX, radarCenterY);
      radarGrad.addColorStop(0, "rgba(16, 185, 129, 0.12)");
      radarGrad.addColorStop(0.08, "rgba(132, 204, 22, 0.03)");
      radarGrad.addColorStop(0.2, "rgba(16, 185, 129, 0)");
      radarGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

      ctx.fillStyle = radarGrad;
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Faint Concentric Radar Rings
      for (let r = 100; r <= 450; r += 110) {
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Connect Nearby Nodes with Laser Grid Lines
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulse += n1.pulseSpeed;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Connect nodes to each other
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect node to mouse pointer
        const mdx = mouse.x - n1.x;
        const mdy = mouse.y - n1.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const malpha = (1 - mdist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(132, 204, 22, ${malpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw Glowing Node Point
        const currentSize = n1.size + Math.sin(n1.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, Math.max(1, currentSize), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.85)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(16, 185, 129, 0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Draw Interactive Target Reticle around Mouse
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(132, 204, 22, 0.35)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(132, 204, 22, 0.8)";
        ctx.fill();
      }

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
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-400/15 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-lime-300/20 rounded-full blur-3xl animate-pulse-glow style-delay" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[400px] bg-teal-300/15 rounded-full blur-3xl" />

      {/* Interactive AgriTech Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
