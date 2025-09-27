import React, { useRef } from "react";

// Pixel class for animation
class Pixel {
  constructor(ctx, x, y, color, speed, delay) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed * (Math.random() * 0.9 + 0.1);
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 1.4;
    this.maxSizeInteger = 2.4;
    this.maxSize = Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;
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
    if (this.size <= 0) this.isIdle = true;
    else this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.isReverse ? (this.size -= this.speed) : (this.size += this.speed);
  }
}

// Imperative canvas setup
function setupCanvas(canvas, options) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { gap, speed, colors, variant } = options;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const pixels = [];
  for (let x = 0; x < rect.width; x += gap) {
    for (let y = 0; y < rect.height; y += gap) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = variant === "icon"
        ? Math.hypot(x - rect.width / 2, y - rect.height / 2)
        : Math.hypot(x, rect.height - y);
      pixels.push(new Pixel(ctx, x, y, color, speed * 0.001, delay));
    }
  }

  let animationFrame;
  const animate = (method) => {
    cancelAnimationFrame(animationFrame);
    const loop = () => {
      animationFrame = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allIdle = true;
      for (const pixel of pixels) {
        pixel[method]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle) cancelAnimationFrame(animationFrame);
    };
    loop();
  };

  const parent = canvas.parentElement;
  if (parent) {
    parent.addEventListener("mouseenter", () => animate("appear"));
    parent.addEventListener("mouseleave", () => animate("disappear"));
  }
}

export const FeatureCard = ({
  icon,
  title,
  description,
  colors = ["#0a0a0a", "#1a1a1a", "#2c2c2c", "#444444", "#666666"], // metallic black shades for animation
  gap = 5,
  speed = 35,
  variant = "default"
}) => {
  const canvasRef = useRef(null);

  const handleCanvasRef = (node) => {
    if (node && !canvasRef.current) {
      canvasRef.current = node;
      setupCanvas(node, { gap, speed, colors, variant });
    }
  };

  return (
 <div
  className="relative group p-6 rounded-2xl shadow-xl border border-gray-700 overflow-hidden flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.03]"
  style={{
    background: `linear-gradient(
      135deg,
       #000000 0%,      /* pure black */
  #0a0a0a 15%,     /* very dark gray */
  #0f0f0f 30%,     /* subtle metallic hint */
  #1a1a1a 50%,     /* metallic shadow */
  #121212 65%,     /* slightly lighter streak */
  #1e1e1e 85%,     /* deep metallic mid-tone */
  #000000 100%     /* back to pure black */
    )`,
  }}
>
  <canvas
    ref={handleCanvasRef}
    className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
  />
  <div className="relative z-[2] flex flex-col items-center">
    {icon}
    <h3 className="text-xl font-bold mb-2 text-gray-200">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
</div>


  );
};
