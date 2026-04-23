import { PinIcon } from "@assets";

interface Props {
  x: number;
  y: number;
  scale: number;
  count: number;
}

const MapClusterMarker = ({ x, y, scale, count }: Props) => {
  const size = count < 10 ? 32 : count < 50 ? 40 : 50;

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${1 / scale})`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <PinIcon />
      <span className="absolute text-sm text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {count}
      </span>
    </div>
  );
};

export default MapClusterMarker;
