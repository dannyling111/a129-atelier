export async function exportScenePng(opts: {
  characterSrc: string;
  backgroundSrc?: string | null;
  name?: string;
  line?: string | null;
  filename: string;
}) {
  const W = 720;
  const H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (opts.backgroundSrc) {
    const bg = await loadImage(opts.backgroundSrc);
    drawCover(ctx, bg, W, H);
  } else {
    ctx.fillStyle = "#efe8dc";
    ctx.fillRect(0, 0, W, H);
    const size = 18;
    ctx.fillStyle = "#e4dbcd";
    for (let y = 0; y < H; y += size) {
      for (let x = 0; x < W; x += size) {
        if ((x / size + y / size) % 2 === 0) ctx.fillRect(x, y, size, size);
      }
    }
  }

  const char = await loadImage(opts.characterSrc);
  const maxH = H * 0.92;
  const scale = Math.min(W / char.width, maxH / char.height);
  const cw = char.width * scale;
  const ch = char.height * scale;
  ctx.drawImage(char, (W - cw) / 2, H - ch, cw, ch);

  if (opts.line) {
    const pad = 28;
    const boxW = W - pad * 2;
    const boxY = H - 168;
    roundRect(ctx, pad, boxY, boxW, 140, 20);
    ctx.fillStyle = "rgba(250,247,242,0.94)";
    ctx.fill();
    ctx.fillStyle = "#9e5d66";
    ctx.font = "600 18px 'Noto Serif SC', serif";
    ctx.fillText(opts.name ?? "", pad + 22, boxY + 36);
    ctx.fillStyle = "#3f3a36";
    ctx.font = "400 20px 'Noto Sans SC', sans-serif";
    wrapText(ctx, opts.line, pad + 22, boxY + 70, boxW - 44, 30);
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = opts.filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function downloadAsset(src: string, filename: string) {
  const res = await fetch(src);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = [...text];
  let line = "";
  let yy = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = ch;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
