"use client";

import { useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { AssemblyMap } from "@assets";
import { useMapActions, useMapCluster, useRestaurants } from "@hooks";
import { RestaurantType } from "@types";
import { Toast } from "@components/common";
import MapPin from "./MapPin";
import MapDetail from "./MapDetail";
import MapClusterMarker from "./MapClusterMarker";
import { PointFeature } from "supercluster";

interface ClusterProperties {
  cluster?: boolean;
  restaurant: RestaurantType;
  cluster_id?: number;
  point_count?: number;
  point_count_abbreviated?: string | number;
}

const Map = ({}) => {
  const { isLoading, isError, restaurants } = useRestaurants();

  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [scale, setScale] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    RestaurantType[]
  >([]);

  const { clusters } = useMapCluster({ restaurants, scale });

  const { handleMapClick } = useMapActions({
    transformComponentRef,
    containerRef,
    setToastMessage,
  });
  const handleCluster = (
    event: React.MouseEvent,
    targetX: number,
    targetY: number
  ) => {
    event.stopPropagation();
    const clusterRestaurants = restaurants.filter((r) => {
      return parseFloat(r.map_x) === targetX && parseFloat(r.map_y) === targetY;
    });

    setSelectedRestaurants(clusterRestaurants);
  };

  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-full animate-pulse">
        <div className="w-12 h-12 mb-4 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-error">Someting Wrong!</p>
      </div>
    );
  }

  return (
    <main className="relative flex items-center justify-center w-full h-full overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={10}
        limitToBounds={false}
        smooth={true}
        wheel={{
          step: 0.003,
          wheelDisabled: false,
          touchPadDisabled: false,
        }}
        zoomAnimation={{ animationTime: 200 }}
        onTransform={(ref) => setScale(ref.state.scale)}
        ref={transformComponentRef}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full flex justify-center items-center"
          contentClass="!h-full"
        >
          <div
            ref={containerRef}
            onClick={handleMapClick}
            className={`relative flex items-center justify-center w-max active:cursor-grabbing`}
          >
            <AssemblyMap className="w-full h-auto" />
            {clusters.map((c) => {
              const [x, y] = c.geometry.coordinates;
              const { cluster, point_count } = c.properties;
              return cluster ? (
                <MapClusterMarker
                  key={`cluster-${c.id}`}
                  x={x}
                  y={y}
                  scale={scale}
                  count={point_count}
                  onClick={(e) => !e.ctrlKey && handleCluster(e, x, y)}
                />
              ) : (
                <MapPin
                  key={c.properties.restaurant.id}
                  restaurant={c.properties.restaurant}
                  scale={scale}
                  onClick={(e) => !e.ctrlKey && handleCluster(e, x, y)}
                />
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
      {selectedRestaurants.length > 0 && (
        <MapDetail
          selectedRestaurants={selectedRestaurants}
          onClose={() => setSelectedRestaurants([])}
        />
      )}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </main>
  );
};

export default Map;
