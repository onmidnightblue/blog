"use client";

import { PinIcon } from "@assets";
import { RestaurantType } from "@types";

interface MapPinProps {
  restaurant: RestaurantType;
  scale: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MapPin = ({ onClick, scale, restaurant }: MapPinProps) => {
  const { map_x, map_y, name } = restaurant || {};

  return (
    <div
      className="absolute transition-all duration-300 cursor-pointer"
      style={{
        left: `${map_x}%`,
        top: `${map_y}%`,
        transform: `translate(-50%, -50%) scale(${1 / scale})`,
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center group">
        <div className="transition duration-300 hover:scale-120">
          <PinIcon />
        </div>
        <div className="px-1 text-sm whitespace-nowrap">{name}</div>
      </div>
    </div>
  );
};

export default MapPin;
