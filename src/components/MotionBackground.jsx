import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function MotionBackground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  
  // Mouse coordinates (screen space)
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false
  });

  // Spotlight coordinates (interpolated cursor position)
  const spotlightRef = useRef({ x: -1000, y: -1000 });

  // Scroll coordinates
  const scrollRef = useRef({ y: 0, targetY: 0 });

  // Theme-specific color parameters
  const getThemeColors = (dark) => {
    return dark ? {
      particle: "rgba(212, 175, 55, ", // Gold (with trailing alpha bracket)
      line: "rgba(212, 175, 55, ",
      spotlight: ["rgba(212, 175, 55, 0.12)", "rgba(212, 175, 55, 0.0)"],
      blob: [
        "rgba(212, 175, 55, 0.045)", // Gold blob
        "rgba(245, 158, 11, 0.03)"   // Amber blob
      ]
    } : {
      particle: "rgba(17, 17, 17, ", // Charcoal
      line: "rgba(17, 17, 17, ",
      spotlight: ["rgba(17, 17, 17, 0.05)", "rgba(17, 17, 17, 0.0)"],
      blob: [
        "rgba(17, 17, 17, 0.025)", // Charcoal blob
        "rgba(85, 85, 85, 0.015)"  // Dark grey blob
      ]
    };
  };

  const colors = getThemeColors(isDark);

  // Large slowly drifting energy blobs
  const blobsRef = useRef([
    { x: 200, y: 150, vx: 0.12, vy: 0.08, radius: 450, colorIndex: 0 },
    { x: 1000, y: 400, vx: -0.08, vy: 0.15, radius: 550, colorIndex: 1 },
    { x: 400, y: 750, vx: 0.15, vy: -0.12, radius: 480, colorIndex: 0 },
    { x: 1300, y: 550, vx: -0.1, vy: -0.08, radius: 520, colorIndex: 1 }
  ]);

  // Particles
  const particlesRef = useRef([]);
  const particleCount = 135; // 120-150 range

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles
    const initParticles = () => {
      const arr = [];
      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = 0.15 + Math.random() * 0.35;
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseSpeed: 0.25 + Math.random() * 0.35,
          radius: 1.25 + Math.random() * 1.75,
          baseAlpha: baseAlpha,
          alpha: baseAlpha,
          glow: 0
        });
      }
      particlesRef.current = arr;
    };

    initParticles();

    // Listeners
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Redistribute particles out of bounds
      particlesRef.current.forEach(p => {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Smoothly interpolate scroll (lag/lerp)
      scrollRef.current.y += (scrollRef.current.targetY - scrollRef.current.y) * 0.08;

      // 2. Smoothly interpolate cursor (lag/lerp)
      if (mouseRef.current.active) {
        if (spotlightRef.current.x === -1000) {
          spotlightRef.current.x = mouseRef.current.targetX;
          spotlightRef.current.y = mouseRef.current.targetY;
        } else {
          spotlightRef.current.x += (mouseRef.current.targetX - spotlightRef.current.x) * 0.07;
          spotlightRef.current.y += (mouseRef.current.targetY - spotlightRef.current.y) * 0.07;
        }
        
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;
      } else {
        spotlightRef.current.x += (-1000 - spotlightRef.current.x) * 0.07;
        spotlightRef.current.y += (-1000 - spotlightRef.current.y) * 0.07;
        mouseRef.current.x += (-1000 - mouseRef.current.x) * 0.15;
        mouseRef.current.y += (-1000 - mouseRef.current.y) * 0.15;
      }

      // 3. Draw energy blobs (behind the constellation network)
      blobsRef.current.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce softly
        const padding = 150;
        if (blob.x - blob.radius < -padding) { blob.x = -padding + blob.radius; blob.vx *= -1; }
        if (blob.x + blob.radius > width + padding) { blob.x = width + padding - blob.radius; blob.vx *= -1; }
        if (blob.y - blob.radius < -padding) { blob.y = -padding + blob.radius; blob.vy *= -1; }
        if (blob.y + blob.radius > height + padding) { blob.y = height + padding - blob.radius; blob.vy *= -1; }

        const blobGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        blobGrad.addColorStop(0, colors.blob[blob.colorIndex]);
        blobGrad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = blobGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // 4. Draw Radial Cursor Spotlight
      if (spotlightRef.current.x !== -1000) {
        const spotGrad = ctx.createRadialGradient(
          spotlightRef.current.x, spotlightRef.current.y, 0,
          spotlightRef.current.x, spotlightRef.current.y, 380
        );
        spotGrad.addColorStop(0, colors.spotlight[0]);
        spotGrad.addColorStop(1, colors.spotlight[1]);
        
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(spotlightRef.current.x, spotlightRef.current.y, 380, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Parallax field coordinate shift offsets
      // Shifts constellation network by max 10-20px based on cursor position relative to center
      const parallaxX = mouseRef.current.active ? (mouseRef.current.x - width / 2) * 0.015 : 0;
      const parallaxY = mouseRef.current.active ? (mouseRef.current.y - height / 2) * 0.015 : 0;
      const scrollShiftY = -scrollRef.current.y * 0.12; // Shifts upwards slightly on scroll down

      // Translate context to apply parallax & scroll displacement globally to particles & connections
      ctx.save();
      ctx.translate(parallaxX, parallaxY + scrollShiftY);

      // Adjust mouse coords to translated canvas space to compute accurate physics attraction
      const canvasMouseX = mouseRef.current.targetX - parallaxX;
      const canvasMouseY = mouseRef.current.targetY - (parallaxY + scrollShiftY);

      // Update particle physics
      const particles = particlesRef.current;
      const attractionRadius = 180;

      particles.forEach(p => {
        // Natural drift speed vector heading
        const angleNormal = Math.atan2(p.vy, p.vx);
        
        if (mouseRef.current.active && mouseRef.current.targetX !== -1000) {
          const dx = canvasMouseX - p.x;
          const dy = canvasMouseY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < attractionRadius) {
            // Magnetic field attraction force (higher force closer to cursor)
            const force = (attractionRadius - dist) / attractionRadius;
            const angleAttract = Math.atan2(dy, dx);

            // Pull towards mouse
            p.vx += Math.cos(angleAttract) * force * 0.07;
            p.vy += Math.sin(angleAttract) * force * 0.07;

            // Cap the magnetic acceleration speed to keep movement smooth
            const speed = Math.hypot(p.vx, p.vy);
            const maxSpeed = 1.6;
            if (speed > maxSpeed) {
              p.vx = (p.vx / speed) * maxSpeed;
              p.vy = (p.vy / speed) * maxSpeed;
            }

            // Glow and opacity increase
            p.alpha = Math.min(0.9, p.baseAlpha + force * 0.45);
            p.glow = force * 4.5;
          } else {
            // Decelerate back to normal ambient speed
            p.glow = 0;
            p.alpha = p.alpha + (p.baseAlpha - p.alpha) * 0.1;

            const speed = Math.hypot(p.vx, p.vy);
            if (speed > p.baseSpeed) {
              p.vx *= 0.96;
              p.vy *= 0.96;
            } else {
              // Maintain minimum ambient drift speed
              p.vx = Math.cos(angleNormal) * p.baseSpeed;
              p.vy = Math.sin(angleNormal) * p.baseSpeed;
            }
          }
        } else {
          // No mouse: maintain base speed drift
          p.glow = 0;
          p.alpha = p.alpha + (p.baseAlpha - p.alpha) * 0.1;
          const speed = Math.hypot(p.vx, p.vy);
          if (Math.abs(speed - p.baseSpeed) > 0.05) {
            p.vx = (p.vx / speed) * p.baseSpeed;
            p.vy = (p.vy / speed) * p.baseSpeed;
          }
        }

        // Apply movement vector
        p.x += p.vx;
        p.y += p.vy;

        // Bounce softly off screen boundaries
        if (p.x < 0) { p.x = 0; p.vx = -p.vx * 0.85; }
        else if (p.x > width) { p.x = width; p.vx = -p.vx * 0.85; }
        if (p.y < 0) { p.y = 0; p.vy = -p.vy * 0.85; }
        else if (p.y > height) { p.y = height; p.vy = -p.vy * 0.85; }
      });

      // 6. Draw connecting constellation lines
      const maxLineDist = 110;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

          if (dist < maxLineDist) {
            // Line opacity based on distance
            let alphaVal = (1 - dist / maxLineDist) * 0.16;

            // Connections brighten if cursor is close to either point
            if (mouseRef.current.active && mouseRef.current.targetX !== -1000) {
              const dM1 = Math.hypot(p1.x - canvasMouseX, p1.y - canvasMouseY);
              const dM2 = Math.hypot(p2.x - canvasMouseX, p2.y - canvasMouseY);

              if (dM1 < attractionRadius) {
                alphaVal += ((attractionRadius - dM1) / attractionRadius) * 0.22;
              }
              if (dM2 < attractionRadius) {
                alphaVal += ((attractionRadius - dM2) / attractionRadius) * 0.22;
              }
            }

            ctx.strokeStyle = colors.line + alphaVal.toFixed(3) + ")";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 7. Draw particle points
      particles.forEach(p => {
        ctx.fillStyle = colors.particle + p.alpha.toFixed(3) + ")";
        
        if (p.glow > 0) {
          ctx.shadowBlur = p.glow;
          ctx.shadowColor = isDark ? "#D4AF37" : "#111111";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow blur
      ctx.shadowBlur = 0;
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    // Pause when tab is inactive to preserve battery life and cycles
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-500"
      style={{
        mixBlendMode: "normal",
        // In dark mode, draw canvas on a pure black wash. In light mode, transparent.
        backgroundColor: isDark ? "#0A0A0A" : "transparent"
      }}
    />
  );
}
