"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  CONTACT_TARGET_MAP,
  type ContactTarget,
  type ContactTargetId,
} from "@constants";
import {
  resolveCollectibles,
  resolveMushrooms,
  resolveSpawn,
  WORLD_WIDTH,
  type ResolvedCollectible,
} from "./contact-level";
import {
  buildCollectibleRects,
  buildMushroomRects,
  buildPlayerRects,
  PixelSprite,
} from "./pixel-sprites";

const PLAYER_BASE = {
  width: 30,
  height: 42,
  spriteScale: 1.5,
  moveSpeed: 20,
} as const;

const MUSHROOM_GROWTH = 1.2;

function getPlayerBounds(sizeMultiplier: number) {
  return {
    width: PLAYER_BASE.width * sizeMultiplier,
    height: PLAYER_BASE.height * sizeMultiplier,
    spriteScale: PLAYER_BASE.spriteScale * sizeMultiplier,
  };
}

type Keys = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

type PlayerState = {
  x: number;
  y: number;
  facing: 1 | -1;
};

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function ContactPlatformGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraLayerRef = useRef<HTMLDivElement>(null);
  const playerElRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Keys>({
    left: false,
    right: false,
    up: false,
    down: false,
  });
  const playerRef = useRef<PlayerState>({ x: 0, y: 0, facing: 1 });
  const cameraRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const collectedRef = useRef<Set<ContactTargetId>>(new Set());
  const rafRef = useRef<number>(0);
  const scaleRef = useRef(1);
  const viewHeightRef = useRef(600);
  const collectiblesRef = useRef<ResolvedCollectible[]>([]);
  const spawnInitializedRef = useRef(false);
  const overlappingRef = useRef<ContactTargetId | null>(null);
  const animFrameRef = useRef(0);
  const playerSizeRef = useRef(1);
  const eatenMushroomsRef = useRef<Set<number>>(new Set());
  const mushroomsRef = useRef<ReturnType<typeof resolveMushrooms>>([]);

  const [activeTarget, setActiveTarget] = useState<ContactTarget | null>(null);
  const [collectedCount, setCollectedCount] = useState(0);
  const [worldHeight, setWorldHeight] = useState(600);
  const [scale, setScale] = useState(1);
  const [animFrame, setAnimFrame] = useState(0);
  const [playerFacing, setPlayerFacing] = useState<1 | -1>(1);
  const [collectedIds, setCollectedIds] = useState<ContactTargetId[]>([]);
  const [playerSize, setPlayerSize] = useState(1);
  const [eatenMushrooms, setEatenMushrooms] = useState<number[]>([]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const setKey = useCallback((key: keyof Keys, pressed: boolean) => {
    keysRef.current[key] = pressed;
  }, []);

  const handleCollect = useCallback((id: ContactTargetId) => {
    const isNew = !collectedRef.current.has(id);
    if (isNew) {
      collectedRef.current.add(id);
      setCollectedCount(collectedRef.current.size);
      setCollectedIds(Array.from(collectedRef.current));
    }
    setActiveTarget(CONTACT_TARGET_MAP[id]);
  }, []);

  const collectibles = useMemo(
    () => resolveCollectibles(worldHeight),
    [worldHeight],
  );

  const mushrooms = useMemo(
    () => resolveMushrooms(worldHeight),
    [worldHeight],
  );

  useEffect(() => {
    collectiblesRef.current = collectibles;
  }, [collectibles]);

  useEffect(() => {
    mushroomsRef.current = mushrooms;
  }, [mushrooms]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncWorld = () => {
      const rect = container.getBoundingClientRect();
      const nextScale = rect.width / WORLD_WIDTH;
      const nextWorldHeight = rect.height / nextScale;

      scaleRef.current = nextScale;
      viewHeightRef.current = nextWorldHeight;
      setScale(nextScale);
      setWorldHeight(nextWorldHeight);

      if (!spawnInitializedRef.current) {
        const spawn = resolveSpawn(nextWorldHeight);
        const bounds = getPlayerBounds(playerSizeRef.current);
        playerRef.current.x = spawn.x - bounds.width / 2;
        playerRef.current.y = spawn.y - bounds.height / 2;
        spawnInitializedRef.current = true;
      } else {
        const player = playerRef.current;
        const bounds = getPlayerBounds(playerSizeRef.current);
        player.x = clamp(player.x, 0, WORLD_WIDTH - bounds.width);
        player.y = clamp(player.y, 0, nextWorldHeight - bounds.height);
      }
    };

    syncWorld();
    const observer = new ResizeObserver(syncWorld);
    observer.observe(container);

    const step = () => {
      frameRef.current += 1;
      const keys = keysRef.current;
      const player = playerRef.current;
      const currentWorldHeight = viewHeightRef.current;
      const currentCollectibles = collectiblesRef.current;

      let dx = 0;
      let dy = 0;
      if (keys.left) dx -= 1;
      if (keys.right) dx += 1;
      if (keys.up) dy -= 1;
      if (keys.down) dy += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      if (dx < 0) player.facing = -1;
      if (dx > 0) player.facing = 1;

      player.x += dx * PLAYER_BASE.moveSpeed;
      player.y += dy * PLAYER_BASE.moveSpeed;

      let playerBounds = getPlayerBounds(playerSizeRef.current);
      player.x = clamp(player.x, 0, WORLD_WIDTH - playerBounds.width);
      player.y = clamp(player.y, 0, currentWorldHeight - playerBounds.height);

      for (let index = 0; index < mushroomsRef.current.length; index += 1) {
        if (eatenMushroomsRef.current.has(index)) continue;

        const mushroom = mushroomsRef.current[index];
        if (
          rectsOverlap(
            player.x,
            player.y,
            playerBounds.width,
            playerBounds.height,
            mushroom.x,
            mushroom.y,
            mushroom.size,
            mushroom.size,
          )
        ) {
          eatenMushroomsRef.current.add(index);
          playerSizeRef.current *= MUSHROOM_GROWTH;
          setPlayerSize(playerSizeRef.current);
          setEatenMushrooms(Array.from(eatenMushroomsRef.current));

          const grownBounds = getPlayerBounds(playerSizeRef.current);
          player.x = clamp(player.x, 0, WORLD_WIDTH - grownBounds.width);
          player.y = clamp(player.y, 0, currentWorldHeight - grownBounds.height);
          break;
        }
      }

      playerBounds = getPlayerBounds(playerSizeRef.current);

      const hit = currentCollectibles.find((item) =>
        rectsOverlap(
          player.x,
          player.y,
          playerBounds.width,
          playerBounds.height,
          item.x,
          item.y,
          item.size,
          item.size,
        ),
      );

      if (hit) {
        if (overlappingRef.current !== hit.id) {
          overlappingRef.current = hit.id;
          handleCollect(hit.id);
        }
      } else {
        overlappingRef.current = null;
      }

      const currentScale = scaleRef.current;
      const viewWidth = container.getBoundingClientRect().width / currentScale;
      const viewHeight = viewHeightRef.current;

      cameraRef.current = {
        x: clamp(
          player.x + playerBounds.width / 2 - viewWidth / 2,
          0,
          Math.max(0, WORLD_WIDTH - viewWidth),
        ),
        y: clamp(
          player.y + playerBounds.height / 2 - viewHeight / 2,
          0,
          Math.max(0, currentWorldHeight - viewHeight),
        ),
      };

      const nextAnimFrame =
        dx !== 0 || dy !== 0 ? Math.floor(frameRef.current / 8) : 0;

      if (playerElRef.current) {
        playerElRef.current.style.transform = `translate(${player.x}px, ${player.y}px)`;
      }

      if (cameraLayerRef.current) {
        cameraLayerRef.current.style.transform = `translate(${-cameraRef.current.x}px, ${-cameraRef.current.y}px)`;
      }

      if (animFrameRef.current !== nextAnimFrame) {
        animFrameRef.current = nextAnimFrame;
        setAnimFrame(nextAnimFrame);
      }

      setPlayerFacing((prev) =>
        prev === player.facing ? prev : player.facing,
      );

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [handleCollect]);

  useEffect(() => {
    const preventScroll = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", preventScroll);
    return () => window.removeEventListener("keydown", preventScroll);
  }, []);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        setKey("left", true);
        break;
      case "ArrowRight":
        setKey("right", true);
        break;
      case "ArrowUp":
        setKey("up", true);
        break;
      case "ArrowDown":
        setKey("down", true);
        break;
    }
  };

  const onKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        setKey("left", false);
        break;
      case "ArrowRight":
        setKey("right", false);
        break;
      case "ArrowUp":
        setKey("up", false);
        break;
      case "ArrowDown":
        setKey("down", false);
        break;
    }
  };

  const playerBounds = useMemo(
    () => getPlayerBounds(playerSize),
    [playerSize],
  );

  const playerRects = useMemo(
    () =>
      buildPlayerRects(
        0,
        0,
        playerFacing,
        animFrame,
        playerBounds.spriteScale,
      ),
    [playerFacing, animFrame, playerBounds.spriteScale],
  );

  const collectedSet = useMemo(() => new Set(collectedIds), [collectedIds]);
  const eatenMushroomSet = useMemo(() => new Set(eatenMushrooms), [eatenMushrooms]);

  return (
    <div className="contact-platform relative flex flex-1 min-h-0 flex-col">
      <div className="shrink-0 px-4 pt-4 md:px-8 md:pt-5">
        <h1 className="font-paperozi text-2xl md:text-3xl font-bold text-foreground">
          Contact
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Move around and find each pixel icon hidden in the sky.
        </p>
      </div>

      <div className="contact-platform__hud shrink-0 flex justify-between px-4 pb-3 pt-2 text-xs font-medium text-foreground md:px-8">
        <span>Found {collectedCount}/6</span>
        <span>↑ ↓ ← → move</span>
      </div>

      <div
        ref={containerRef}
        className="contact-platform__stage relative flex-1 min-h-0 w-full overflow-hidden"
        tabIndex={0}
        role="application"
        aria-label="Contact exploration game"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={() => containerRef.current?.focus()}
      >
        <div
          className="contact-platform__viewport absolute left-0 top-0 origin-top-left"
          style={{
            width: WORLD_WIDTH,
            height: worldHeight,
            transform: `scale(${scale})`,
          }}
        >
          <div
            ref={cameraLayerRef}
            className="contact-platform__world absolute left-0 top-0"
            style={{ width: WORLD_WIDTH, height: worldHeight }}
          >
            <div className="absolute inset-0 bg-white" aria-hidden="true" />

            {mushrooms.map((mushroom, index) =>
              eatenMushroomSet.has(index) ? null : (
                <div
                  key={index}
                  className="contact-platform__mushroom absolute"
                  style={{
                    left: mushroom.x,
                    top: mushroom.y,
                    width: mushroom.size,
                    height: mushroom.size,
                  }}
                >
                  <PixelSprite
                    rects={buildMushroomRects(0, 0, mushroom.size)}
                  />
                </div>
              ),
            )}

            {collectibles.map((item) => (
              <div
                key={item.id}
                className="contact-platform__collectible absolute"
                style={{ left: item.x, top: item.y, width: item.size, height: item.size }}
              >
                <PixelSprite
                  rects={buildCollectibleRects(
                    item.id,
                    0,
                    0,
                    item.size,
                    collectedSet.has(item.id),
                  )}
                />
              </div>
            ))}

            <div
              ref={playerElRef}
              className="contact-platform__player absolute left-0 top-0"
              style={{
                width: playerBounds.width,
                height: playerBounds.height,
              }}
            >
              <PixelSprite rects={playerRects} className="absolute inset-0" />
            </div>
          </div>
        </div>

        {activeTarget ? (
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-8 md:pb-6">
            <div className="contact-platform__modal rounded-2xl border border-black/10 bg-white p-4 md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground-muted">
                    {activeTarget.label}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{activeTarget.description}</p>
                </div>
                <button
                  type="button"
                  className="text-sm text-foreground-muted hover:text-foreground"
                  onClick={() => setActiveTarget(null)}
                >
                  Close
                </button>
              </div>
              <a
                href={activeTarget.href}
                target={activeTarget.external ? "_blank" : undefined}
                rel={activeTarget.external ? "noreferrer noopener" : undefined}
                className="mt-3 inline-flex text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-70"
              >
                Open link
              </a>
            </div>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 md:px-8 md:pb-6">
            <p className="text-xs text-foreground-muted">
              Icons are scattered across the area — explore freely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
