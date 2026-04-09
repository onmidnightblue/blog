"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { AssemblyMap } from "@images";
import useIsMobile from "../hooks/useIsMobile";

const Map = ({}) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full relative overflow-hidden">
      <TransformWrapper
        initialScale={isMobile ? 1.6 : 0.6}
        key={`map-wrap-${isMobile ? 1.6 : 0.6}`}
        centerOnInit={true}
        minScale={0.5}
        maxScale={5}
        limitToBounds={false}
        wheel={{
          step: 0.01,
        }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full"
        >
          <div className="w-full h-full flex items-center justify-center">
            <AssemblyMap className=" object-contain" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Map;
