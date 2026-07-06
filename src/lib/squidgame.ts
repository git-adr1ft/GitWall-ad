import type { CanvasRenderingContext2D } from "canvas";

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
