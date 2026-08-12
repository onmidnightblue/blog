const WHITE = "#ffffff";
const BLACK = "#000000";

export type PixelRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity?: number;
};

function px(
  rects: PixelRect[],
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  opacity?: number,
) {
  rects.push({
    x: Math.round(x),
    y: Math.round(y),
    w,
    h,
    color,
    opacity,
  });
}

export function buildMushroomRects(x: number, y: number, size: number): PixelRect[] {
  const rects: PixelRect[] = [];
  const s = size / 32;

  px(rects, x + 4 * s, y + 2 * s, 24 * s, 6 * s, BLACK);
  px(rects, x + 2 * s, y + 8 * s, 28 * s, 6 * s, BLACK);
  px(rects, x + 6 * s, y + 14 * s, 20 * s, 4 * s, BLACK);
  px(rects, x + 8 * s, y + 4 * s, 4 * s, 4 * s, WHITE);
  px(rects, x + 18 * s, y + 6 * s, 4 * s, 4 * s, WHITE);
  px(rects, x + 12 * s, y + 18 * s, 8 * s, 12 * s, WHITE);
  pushOutline(rects, x + 12 * s, y + 18 * s, 8 * s, 12 * s);
  px(rects, x + 10 * s, y + 30 * s, 12 * s, 2 * s, BLACK);

  return rects;
}

export function buildPlayerRects(
  x: number,
  y: number,
  facing: 1 | -1,
  frame: number,
  spriteScale = 1.5,
): PixelRect[] {
  const rects: PixelRect[] = [];
  const s = spriteScale;
  const body = x;

  px(rects, body + 2 * s, y + 4 * s, 16 * s, 8 * s, BLACK);
  px(rects, body + 4 * s, y + 8 * s, 12 * s, 12 * s, BLACK);
  px(rects, body + 2 * s, y + 20 * s, 16 * s, 8 * s, BLACK);
  px(rects, body + (facing === 1 ? 12 * s : 2 * s), y + 10 * s, 4 * s, 4 * s, WHITE);

  const legOffset = (frame % 2 === 0 ? 0 : 2) * s;
  px(rects, body + 4 * s + legOffset, y + 26 * s, 4 * s, 4 * s, BLACK);
  px(rects, body + 10 * s - legOffset, y + 26 * s, 4 * s, 4 * s, BLACK);

  return rects;
}

function pushGlow(rects: PixelRect[], x: number, y: number, size: number) {
  px(rects, x - 4, y - 4, size + 8, size + 8, BLACK, 0.25);
}

function buildPhoneRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 40;
  px(rects, x + 8 * s, y + 2 * s, 24 * s, 36 * s, BLACK);
  px(rects, x + 10 * s, y + 6 * s, 20 * s, 26 * s, WHITE);
  px(rects, x + 16 * s, y + 34 * s, 8 * s, 4 * s, WHITE);
}

function pushOutline(
  rects: PixelRect[],
  x: number,
  y: number,
  w: number,
  h: number,
) {
  px(rects, x, y, w, 1, BLACK);
  px(rects, x, y + h - 1, w, 1, BLACK);
  px(rects, x, y, 1, h, BLACK);
  px(rects, x + w - 1, y, 1, h, BLACK);
}

function buildLetterRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 40;
  px(rects, x + 4 * s, y + 10 * s, 32 * s, 22 * s, WHITE);
  pushOutline(rects, x + 4 * s, y + 10 * s, 32 * s, 22 * s);
  px(rects, x + 4 * s, y + 10 * s, 32 * s, 8 * s, BLACK);
  px(rects, x + 8 * s, y + 22 * s, 20 * s, 2 * s, BLACK);
  px(rects, x + 8 * s, y + 26 * s, 16 * s, 2 * s, BLACK);
}

function buildGithubRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 44;

  px(rects, x + 8 * s, y + 2 * s, 8 * s, 10 * s, BLACK);
  px(rects, x + 28 * s, y + 2 * s, 8 * s, 10 * s, BLACK);
  px(rects, x + 10 * s, y + 4 * s, 4 * s, 4 * s, WHITE);
  px(rects, x + 30 * s, y + 4 * s, 4 * s, 4 * s, WHITE);
  px(rects, x + 6 * s, y + 10 * s, 32 * s, 24 * s, BLACK);
  px(rects, x + 8 * s, y + 12 * s, 28 * s, 20 * s, WHITE);
  px(rects, x + 12 * s, y + 18 * s, 8 * s, 8 * s, BLACK);
  px(rects, x + 24 * s, y + 18 * s, 8 * s, 8 * s, BLACK);
  px(rects, x + 14 * s, y + 20 * s, 2 * s, 2 * s, WHITE);
  px(rects, x + 26 * s, y + 20 * s, 2 * s, 2 * s, WHITE);
  px(rects, x + 18 * s, y + 26 * s, 4 * s, 3 * s, BLACK);
  px(rects, x + 10 * s, y + 34 * s, 24 * s, 10 * s, BLACK);
  px(rects, x + 12 * s, y + 36 * s, 20 * s, 6 * s, WHITE);
  px(rects, x + 0 * s, y + 30 * s, 8 * s, 6 * s, BLACK);
  px(rects, x - 2 * s, y + 34 * s, 8 * s, 8 * s, BLACK);
  px(rects, x + 0 * s, y + 40 * s, 6 * s, 4 * s, BLACK);
}

function buildPersonRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 40;
  px(rects, x + 12 * s, y + 4 * s, 16 * s, 16 * s, WHITE);
  pushOutline(rects, x + 12 * s, y + 4 * s, 16 * s, 16 * s);
  px(rects, x + 8 * s, y + 20 * s, 24 * s, 14 * s, BLACK);
  px(rects, x + 10 * s, y + 34 * s, 8 * s, 8 * s, BLACK);
  px(rects, x + 22 * s, y + 34 * s, 8 * s, 8 * s, BLACK);
}

function buildMedalRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 40;
  px(rects, x + 16 * s, y + 2 * s, 8 * s, 10 * s, BLACK);
  px(rects, x + 10 * s, y + 12 * s, 20 * s, 22 * s, WHITE);
  pushOutline(rects, x + 10 * s, y + 12 * s, 20 * s, 22 * s);
  px(rects, x + 16 * s, y + 18 * s, 8 * s, 10 * s, BLACK);
}

function buildBuildingRects(
  rects: PixelRect[],
  x: number,
  y: number,
  size: number,
  collected: boolean,
) {
  if (!collected) pushGlow(rects, x, y, size);
  const s = size / 44;
  px(rects, x + 8 * s, y + 8 * s, 28 * s, 32 * s, BLACK);
  px(rects, x + 12 * s, y + 14 * s, 6 * s, 6 * s, WHITE);
  px(rects, x + 22 * s, y + 14 * s, 6 * s, 6 * s, WHITE);
  px(rects, x + 12 * s, y + 24 * s, 6 * s, 6 * s, WHITE);
  px(rects, x + 22 * s, y + 24 * s, 6 * s, 6 * s, WHITE);
  px(rects, x + 18 * s, y + 34 * s, 8 * s, 6 * s, WHITE);
}

export function buildCollectibleRects(
  id: string,
  x: number,
  y: number,
  size: number,
  collected: boolean,
): PixelRect[] {
  const rects: PixelRect[] = [];

  switch (id) {
    case "phone":
      buildPhoneRects(rects, x, y, size, collected);
      break;
    case "letter":
      buildLetterRects(rects, x, y, size, collected);
      break;
    case "github":
      buildGithubRects(rects, x, y, size, collected);
      break;
    case "person":
      buildPersonRects(rects, x, y, size, collected);
      break;
    case "medal":
      buildMedalRects(rects, x, y, size, collected);
      break;
    case "building":
      buildBuildingRects(rects, x, y, size, collected);
      break;
  }

  return rects;
}

type PixelSpriteProps = {
  rects: PixelRect[];
  className?: string;
};

export function PixelSprite({ rects, className }: PixelSpriteProps) {
  return (
    <div className={className} aria-hidden="true">
      {rects.map((rect, index) => (
        <div
          key={index}
          className="contact-platform__pixel"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            backgroundColor: rect.color,
            opacity: rect.opacity ?? 1,
          }}
        />
      ))}
    </div>
  );
}
