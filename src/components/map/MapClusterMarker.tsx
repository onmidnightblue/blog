import { PinIcon } from "@assets";

interface Props {
  x: number;
  y: number;
  scale: number;
  count: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MapClusterMarker = ({ x, y, scale, count, onClick }: Props) => {
  const size = count < 10 ? 32 : count < 50 ? 40 : 50;

  return (
    <div
      className="absolute flex items-center justify-center cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${1 / scale})`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
    >
      <PinIcon className="absolute top-1/2 left-1/2 -translate-1/2" />
      <span className="text-xs text-white z-10">{count}</span>
    </div>
  );
};

export default MapClusterMarker;
