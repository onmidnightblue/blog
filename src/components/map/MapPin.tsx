"use client";

import { PinIcon } from "@assets";
import { RestaurantType } from "@types";

interface MapPinProps {
  restaurant: RestaurantType;
  scale: number;
  isActive: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MapPin = ({ restaurant, scale, isActive, onClick }: MapPinProps) => {
  const { map_x, map_y, name } = restaurant || {};

  return (
    <div
      className={`absolute transition-all cursor-pointer`}
      style={{
        left: `${map_x}%`,
        top: `${map_y}%`,
        transform: `translate(-50%, -50%) scale(${1 / scale})`,
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="transition hover:scale-120">
          <PinIcon
            className={`transition ${
              isActive ? "text-blue-400" : "text-foreground"
            }`}
          />
        </div>
        <div className="px-1 text-sm break-keep text-center">{name}</div>
      </div>
    </div>
  );
};

export default MapPin;
