"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { AssemblyMap, PinIcon } from "@images";
import MapPin from "./MapPin";
import { useRef, useState } from "react";
import { RESTAURANTS } from "@constants";

const Map = ({}) => {
  const [scale, setScale] = useState(1);
  const restaurantList = RESTAURANTS;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // 1. 전체 이미지의 크기와 위치 정보 가져오기
    const rect = containerRef.current.getBoundingClientRect();

    // 2. 클릭한 지점의 좌표 계산 (전체 대비 %)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 3. 콘솔에 출력 (이 값을 복사해서 보정치로 쓰세요!)
    console.log(
      `📍 클릭 지점 좌표 -> x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`
    );

    // 선택 사항: 알림으로 띄우기
    // alert(`x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <TransformWrapper
        initialScale={1}
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
        onZoom={(ref) => setScale(ref.state.scale)}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full flex justify-center items-center"
          contentClass="!h-full"
        >
          <div
            ref={containerRef}
            onClick={handleMapClick}
            className="w-max flex justify-center items-center relative cursor-crosshair"
          >
            <AssemblyMap className="w-full h-auto" />
            {restaurantList.map((restaurant) => (
              <MapPin
                key={restaurant.mgtno}
                data={restaurant}
                currentScale={scale}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Map;
