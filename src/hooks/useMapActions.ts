import React from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export interface MapActionProps {
  transformComponentRef: React.RefObject<ReactZoomPanPinchRef | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setToastMessage: (msg: string | null) => void;
}

export const useMapActions = ({
  transformComponentRef,
  containerRef,
  setToastMessage,
}: MapActionProps) => {
  const handleReset = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current?.resetTransform();
    }
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const coordText = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(coordText);
      setToastMessage(coordText);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error", err);
    }
  };

  return { handleMapClick, handleReset };
};
