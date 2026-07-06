import { Image, type CanvasRenderingContext2D } from "canvas";
import fs from "fs";
import path from "path";

export type SquidGameVariant = "masks" | "dalgona" | "tracksuit";

export const SQUIDGAME_VARIANTS: SquidGameVariant[] = [
  "masks",
  "dalgona",
  "tracksuit",
];

function drawCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  strokeColor: string,
  strokeWidth: number,
  fillColor?: string
) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  strokeColor: string,
  strokeWidth: number,
  fillColor?: string
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size / 2);
  ctx.lineTo(cx - size / 2, cy + size / 2);
  ctx.lineTo(cx + size / 2, cy + size / 2);
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  strokeColor: string,
  strokeWidth: number,
  fillColor?: string
) {
  ctx.beginPath();
  ctx.rect(cx - size / 2, cy - size / 2, size, size);
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  strokeColor: string,
  strokeWidth: number,
  fillColor?: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawUmbrella(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  strokeColor: string,
  strokeWidth: number,
  fillColor?: string
) {
  ctx.beginPath();
  // Dome
  ctx.arc(cx, cy - size * 0.1, size * 0.4, Math.PI, 0, false);
  // Bottom waves/ribs
  const r = size * 0.133;
  ctx.arc(cx - size * 0.266, cy - size * 0.1, r, Math.PI * 2, Math.PI, false);
  ctx.arc(cx, cy - size * 0.1, r, Math.PI * 2, Math.PI, false);
  ctx.arc(cx + size * 0.266, cy - size * 0.1, r, Math.PI * 2, Math.PI, false);
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();

  // Handle rod
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.1);
  ctx.lineTo(cx, cy + size * 0.25);
  // J-hook curve
  ctx.arc(cx - size * 0.08, cy + size * 0.25, size * 0.08, 0, Math.PI, false);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

export function drawSquidGameCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  level: number,
  variant: SquidGameVariant,
  seed: number
) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.12; // corner radius for cell background

  if (variant === "masks") {
    // Background - pink jumpsuit
    ctx.fillStyle = level === -1 ? "#1b181e" : "#da1b60";
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === "function") {
      (ctx as any).roundRect(x, y, size, size, r);
    } else {
      ctx.rect(x, y, size, size);
    }
    ctx.fill();

    if (level === -1) {
      // Empty: faint worker mask outline
      drawCircle(ctx, cx, cy, size * 0.25, "#3b383e", 1);
      return;
    }

    // Mask - black ellipse/rounded rect in center
    ctx.fillStyle = "#0c0a0e";
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.33, size * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    const symbolSize = size * 0.25;

    // Symbol printed on mask in white/gold
    if (level === 0) {
      // Circle
      drawCircle(ctx, cx, cy, symbolSize * 0.65, "#ffffff", 1.8);
    } else if (level === 1) {
      // Triangle
      drawTriangle(ctx, cx, cy + 1, symbolSize * 1.25, "#ffffff", 1.8);
    } else if (level === 2) {
      // Square
      drawSquare(ctx, cx, cy, symbolSize * 1.15, "#ffffff", 1.8);
    } else if (level === 3) {
      // Leader: Gold star
      drawStar(ctx, cx, cy, 5, symbolSize * 0.75, symbolSize * 0.3, "#ffcc00", 1.5, "#ffcc00");
    }

  } else if (variant === "dalgona") {
    if (level === -1) {
      // Empty: dark brown empty card with faint circle
      ctx.fillStyle = "#1e140d";
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(x, y, size, size, r);
      } else {
        ctx.rect(x, y, size, size);
      }
      ctx.fill();
      drawCircle(ctx, cx, cy, size * 0.33, "#3d2a1b", 1);
      return;
    }

    // Background - caramel honeycomb color
    const bgColors = ["#e4a867", "#d39450", "#c17f3a", "#a46726"];
    const carvedColors = ["#7b4c20", "#693d16", "#582f0d", "#401e04"];

    ctx.fillStyle = bgColors[level];
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === "function") {
      (ctx as any).roundRect(x, y, size, size, r);
    } else {
      ctx.rect(x, y, size, size);
    }
    ctx.fill();

    // Draw the outer ring of honeycomb candy
    drawCircle(ctx, cx, cy, size * 0.4, carvedColors[level] + "22", 1);

    const carvedColor = carvedColors[level];
    const symbolSize = size * 0.28;

    if (level === 0) {
      drawCircle(ctx, cx, cy, symbolSize * 0.7, carvedColor, 1.8);
    } else if (level === 1) {
      drawTriangle(ctx, cx, cy + 1, symbolSize * 1.25, carvedColor, 1.8);
    } else if (level === 2) {
      drawStar(ctx, cx, cy, 5, symbolSize * 0.75, symbolSize * 0.33, carvedColor, 1.8);
    } else if (level === 3) {
      drawUmbrella(ctx, cx, cy, symbolSize * 1.25, carvedColor, 1.8);
    }

  } else if (variant === "tracksuit") {
    if (level === -1) {
      // Empty: dark teal-gray empty card
      ctx.fillStyle = "#0c1816";
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(x, y, size, size, r);
      } else {
        ctx.rect(x, y, size, size);
      }
      ctx.fill();
      return;
    }

    // Tracksuit colors (increasingly bright green/teal)
    const bgColors = ["#134e4a", "#0d766e", "#0f766e", "#14b8a6"];
    const textColors = ["#99f6e4", "#ccfbf1", "#f0fdfa", "#ffffff"];
    const playerNumbers = ["199", "067", "218", "456"];

    ctx.fillStyle = bgColors[level];
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === "function") {
      (ctx as any).roundRect(x, y, size, size, r);
    } else {
      ctx.rect(x, y, size, size);
    }
    ctx.fill();

    // White tracksuit side stripes
    ctx.fillStyle = "#ffffff22";
    ctx.fillRect(x + 1, y, 2, size);
    ctx.fillRect(x + size - 3, y, 2, size);

    // Draw player number text
    ctx.fillStyle = textColors[level];
    ctx.font = `bold ${Math.round(size * 0.36)}px Inter, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(playerNumbers[level], cx, cy);
  }
}

let cachedBgImg: Image | null = null;
let cachedDalgonaBgImg: Image | null = null;
let cachedTracksuitBgImg: Image | null = null;

export function drawSquidGameSceneBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  variant: SquidGameVariant
) {
  if (variant !== "masks" && variant !== "dalgona" && variant !== "tracksuit") {
    // Only masks, dalgona, and tracksuit variants get custom image backgrounds
    return;
  }

  try {
    if (variant === "masks") {
      if (!cachedBgImg) {
        const imgPath = path.join(process.cwd(), "src", "assets", "squidgame_bg.png");
        if (fs.existsSync(imgPath)) {
          const img = new Image();
          img.src = fs.readFileSync(imgPath);
          cachedBgImg = img;
        }
      }

      if (cachedBgImg) {
        // Cover-fit rendering to scale and center the background image on any device dimension
        const scaleImg = Math.max(width / cachedBgImg.width, height / cachedBgImg.height);
        const dw = cachedBgImg.width * scaleImg;
        const dh = cachedBgImg.height * scaleImg;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(cachedBgImg, dx, dy, dw, dh);
      }
    } else if (variant === "dalgona") {
      if (!cachedDalgonaBgImg) {
        const imgPath = path.join(process.cwd(), "src", "assets", "dalgona_bg.png");
        if (fs.existsSync(imgPath)) {
          const img = new Image();
          img.src = fs.readFileSync(imgPath);
          cachedDalgonaBgImg = img;
        }
      }

      if (cachedDalgonaBgImg) {
        // Cover-fit rendering to scale and center the background image on any device dimension
        const scaleImg = Math.max(width / cachedDalgonaBgImg.width, height / cachedDalgonaBgImg.height);
        const dw = cachedDalgonaBgImg.width * scaleImg;
        const dh = cachedDalgonaBgImg.height * scaleImg;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(cachedDalgonaBgImg, dx, dy, dw, dh);
      }
    } else if (variant === "tracksuit") {
      if (!cachedTracksuitBgImg) {
        const imgPath = path.join(process.cwd(), "src", "assets", "tracksuit_bg.png");
        if (fs.existsSync(imgPath)) {
          const img = new Image();
          img.src = fs.readFileSync(imgPath);
          cachedTracksuitBgImg = img;
        }
      }

      if (cachedTracksuitBgImg) {
        // Draw the background image with cover-fit scaling to show the entire artwork (side stairs, watchtowers, etc.)
        const scaleImg = Math.max(width / cachedTracksuitBgImg.width, height / cachedTracksuitBgImg.height);
        const dw = cachedTracksuitBgImg.width * scaleImg;
        const dh = cachedTracksuitBgImg.height * scaleImg;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(cachedTracksuitBgImg, dx, dy, dw, dh);

        // Draw the glowing neon shapes (Circle, Triangle, Square) dynamically
        // centered horizontally just above the grid activity wall starts
        const gridTop = Math.round(height * 0.36);
        const targetY = gridTop - 56 * scale;
        const shapeSize = 25 * scale;
        const spacing = 72 * scale;
        const color = "#00e5ff"; // neon cyan

        const drawPath = (type: "circle" | "triangle" | "square", cx: number, cy: number, size: number) => {
          ctx.beginPath();
          if (type === "circle") {
            ctx.arc(cx, cy, size * 0.75, 0, Math.PI * 2);
          } else if (type === "triangle") {
            const h = size * 1.5;
            ctx.moveTo(cx, cy - h / 2);
            ctx.lineTo(cx - size * 0.866, cy + h / 4);
            ctx.lineTo(cx + size * 0.866, cy + h / 4);
            ctx.closePath();
          } else if (type === "square") {
            const half = size * 0.7;
            ctx.rect(cx - half, cy - half, half * 2, half * 2);
          }
          ctx.stroke();
        };

        const drawNeon = (type: "circle" | "triangle" | "square", cx: number, cy: number) => {
          ctx.strokeStyle = color;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";

          // Layered glow - thickened for the much larger shapes
          ctx.lineWidth = 15 * scale;
          ctx.globalAlpha = 0.15;
          drawPath(type, cx, cy, shapeSize);

          ctx.lineWidth = 9 * scale;
          ctx.globalAlpha = 0.35;
          drawPath(type, cx, cy, shapeSize);

          ctx.lineWidth = 5 * scale;
          ctx.globalAlpha = 0.65;
          drawPath(type, cx, cy, shapeSize);

          // Crisp core
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.4 * scale;
          ctx.globalAlpha = 1.0;
          drawPath(type, cx, cy, shapeSize);
        };

        ctx.save();
        drawNeon("circle", width / 2 - spacing, targetY);
        drawNeon("triangle", width / 2, targetY);
        drawNeon("square", width / 2 + spacing, targetY);
        ctx.restore();
      }
    }
  } catch (err) {
    console.error(`Failed to load or draw Squid Game (${variant}) background image:`, err);
  }
}
