import React, { useEffect, useRef } from "react";

// Small helper for random values
const randomValue = (min, max) => Math.random() * (max - min) + min;

// Pixel class
class Pixel {
  constructor(ctx, x, y, color, speed, delay) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed * randomValue(0.1, 0.9);
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.3;
    this.maxSizeInteger = 1.2;
    this.maxSize = randomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const offset = (this.maxSizeInteger - this.size) / 2;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    this.isShimmer ? this.shimmer() : (this.size += this.sizeStep);
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.isReverse ? (this.size -= this.speed) : (this.size += this.speed);
  }
}

// React PixelCanvas component
export function PixelCanvas({
  gap = 5,
  speed = 35,
  colors = ["#e0f2fe", "#7dd3fc", "#0ea5e9"],
  variant = "default",
  style,
  ...props
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pixelsRef = useRef([]);

  const createPixels = (ctx, width, height) => {
    const pixels = [];
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay =
          variant === "icon"
            ? Math.hypot(x - width / 2, y - height / 2)
            : Math.hypot(x, height - y);
        pixels.push(new Pixel(ctx, x, y, color, speed * 0.001, delay));
      }
    }
    pixelsRef.current = pixels;
  };

  const animate = (ctx, width, height, method) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, width, height);
      let allIdle = true;
      for (const pixel of pixelsRef.current) {
        pixel[method]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle) cancelAnimationFrame(animationRef.current);
    };
    loop();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // Ensure the canvas exactly matches parent size
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      createPixels(ctx, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mouseenter", () =>
        animate(ctx, canvas.width, canvas.height, "appear")
      );
      parent.addEventListener("mouseleave", () =>
        animate(ctx, canvas.width, canvas.height, "disappear")
      );
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("mouseenter", () =>
          animate(ctx, canvas.width, canvas.height, "appear")
        );
        parent.removeEventListener("mouseleave", () =>
          animate(ctx, canvas.width, canvas.height, "disappear")
        );
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gap, speed, colors, variant]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        ...style,
      }}
      {...props}
    />
  );
}
