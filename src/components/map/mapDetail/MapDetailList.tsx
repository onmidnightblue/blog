import { useEffect, useMemo, useRef, useState } from "react";
import { RestaurantType } from "@types";
import { FlagIcon, LightIcon } from "@assets";
import { useIsMobile } from "@hooks";

interface Props {
  activeRestaurantIdx: number;
  selectedRestaurants: RestaurantType[];
  selectedHandler: (index: number) => void;
}

const MapDetailList = ({
  activeRestaurantIdx,
  selectedRestaurants,
  selectedHandler,
}: Props) => {
  const isMobile = useIsMobile();
  const [showTip, setShowTip] = useState(!isMobile);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const buildingMatch = useMemo(
    () =>
      selectedRestaurants?.[0]?.land_address.match(
        /\d+(?:-\d+)?\s+([가-힣A-Za-z0-9]+)/
      ),
    [selectedRestaurants]
  );
  const buildingName = buildingMatch ? buildingMatch[1] : null;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    direction: "left" | "right"
  ) => {
    if (isHoldingRef.current) {
      e.preventDefault();
      return;
    }
    handleScroll(direction);
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handlePointerDown = (direction: "left" | "right") => {
    isHoldingRef.current = false;
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      const step = direction === "left" ? -8 : 8;
      const scrollLoop = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += step;
          handleScrollEvent();
          animationRef.current = requestAnimationFrame(scrollLoop);
        }
      };
      animationRef.current = requestAnimationFrame(scrollLoop);
    }, 200);
  };

  const handlePointerUpOrLeave = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleScrollEvent();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedRestaurants]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeRestaurantIdx > 0) {
          selectedHandler(activeRestaurantIdx - 1);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (activeRestaurantIdx < selectedRestaurants.length - 1) {
          selectedHandler(activeRestaurantIdx + 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeRestaurantIdx, selectedRestaurants.length, selectedHandler]);

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.children[activeRestaurantIdx]) {
      const activeElement = scrollRef.current.children[
        activeRestaurantIdx
      ] as HTMLElement;
      const container = scrollRef.current;
      const scrollPosition =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeRestaurantIdx]);

  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => {
      setShowTip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <div className="flex flex-col gap-2 w-full bg-white border p-6 pointer-events-auto">
      <div className="text-md mb-1 flex justify-between">
        <div className="flex gap-1">
          <FlagIcon />
          {buildingName} 내 식당 {selectedRestaurants.length}곳
        </div>
        {showTip && !isMobile && (
          <div className="flex gap-1 items-center animate-pulse transition-opacity">
            <LightIcon /> 키보드 방향키 ← → 로 조작할 수 있어요
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={(e) => handleButtonClick(e, "left")}
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className={`${ArrowStyle} left-0 ${
            showLeftArrow ? ActiveArrowStyle : DisabledArrowStyle
          }`}
        >
          <span className="text-xs">←</span>
        </button>
        <div
          ref={scrollRef}
          onScroll={handleScrollEvent}
          className="flex gap-2 overflow-x-auto scroll-smooth w-full [&::-webkit-scrollbar]:hidden"
        >
          {selectedRestaurants.map((r, index) => {
            const { id, name, land_address } = r || {};
            const match = land_address.match(
              /((?:지하\s*|B)?\d+(?:[~,-]\d+)?층)/i
            );
            const floor = match?.[1] || null;
            const isActive = activeRestaurantIdx === index;
            return (
              <button
                key={`map-detail-restaurant-${id}`}
                className={`px-2 py-1 break-keep shrink-0 cursor-pointer flex flex-col gap-1  rounded-lg hover:scale-105 ${
                  isActive ? "text-blue-400 bg-gray-50" : "bg-white"
                }`}
                onClick={() => selectedHandler(index)}
              >
                <div className="text-xs">{floor}</div>
                <div>{name}</div>
              </button>
            );
          })}
        </div>
        <button
          onClick={(e) => handleButtonClick(e, "right")}
          onPointerDown={() => handlePointerDown("right")}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className={`${ArrowStyle} right-0 ${
            showRightArrow ? ActiveArrowStyle : DisabledArrowStyle
          }`}
        >
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
};

// style
const ArrowStyle =
  "flex items-center justify-center w-[24px] h-[24px] rounded-full border";
const ActiveArrowStyle =
  "cursor-pointer hover:bg-foreground hover:text-white transition border-foreground-muted bg-white";
const DisabledArrowStyle = "border-gray-300 text-gray-400 bg-gray-100";

export default MapDetailList;
