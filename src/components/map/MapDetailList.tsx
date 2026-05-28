import { RestaurantType } from "@types";
import { useEffect, useRef, useState } from "react";

interface Props {
  selectedRestaurants: RestaurantType[];
  selectedHandler: (index: number) => void;
}

const MapDetailList = ({ selectedRestaurants, selectedHandler }: Props) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

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

  return (
    <div className="flex flex-col gap-1 mb-8 w-full">
      <div className="text-sm">같은 건물 다른 식당</div>
      <div className="flex gap-2 items-center">
        <div
          onClick={(e) => handleButtonClick(e, "left")}
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className={`${ArrowStyle} left-0 ${
            showLeftArrow ? ActiveArrowStyle : DisabledArrowStyle
          }`}
        >
          <span className="text-xs">←</span>
        </div>
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
            return (
              <div
                key={`map-detail-restaurant-${id}`}
                className="break-keep shrink-0 cursor-pointer py-2 transition hover:scale-105 bg-gray-100 rounded-lg px-2"
                onClick={() => selectedHandler(index)}
              >
                <div className="text-xs">{floor}</div>
                <div>{name}</div>
              </div>
            );
          })}
        </div>
        <div
          onClick={(e) => handleButtonClick(e, "right")}
          onPointerDown={() => handlePointerDown("right")}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className={`${ArrowStyle} right-0 ${
            showRightArrow ? ActiveArrowStyle : DisabledArrowStyle
          }`}
        >
          <span className="text-xs">→</span>
        </div>
      </div>
    </div>
  );
};

// style
const ArrowStyle =
  "flex items-center justify-center w-[24px] h-[24px] rounded-full border";
const ActiveArrowStyle =
  "cursor-pointer hover:bg-foreground hover:text-white transition duration-300 border-foreground-muted bg-white";
const DisabledArrowStyle = "border-gray-300 text-gray-400 bg-gray-100";

export default MapDetailList;
