"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { AssemblyMap } from "@images";

const Map = ({}) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <TransformWrapper
        initialScale={1}
        // centerOnInit={true}
        minScale={0.3}
        maxScale={5}
        limitToBounds={false}
        smooth={true}
        wheel={{
          step: 0.001,
          wheelDisabled: false,
          touchPadDisabled: false,
        }}
        zoomAnimation={{ animationTime: 200 }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full flex justify-center items-center"
          contentClass="!h-full"
        >
          <div className="w-max flex justify-center items-center">
            <AssemblyMap className="w-full" />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Map;
