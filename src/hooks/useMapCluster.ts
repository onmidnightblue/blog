import { useMemo } from "react";
import Supercluster from "supercluster";
import { RestaurantType } from "@types";

type Props = {
  restaurants: RestaurantType[];
  scale: number;
};

export const useMapCluster = ({ restaurants, scale }: Props) => {
  const clusterData = useMemo(() => {
    if (!restaurants) return null;

    const index = new Supercluster({
      radius: 40,
      maxZoom: 40,
    });

    const filter = restaurants.filter((restaurant) => restaurant?.map_x);
    const points = filter.map((restaurant: RestaurantType) => ({
      type: "Feature" as const,
      properties: { cluster: false, restaurant },
      geometry: {
        type: "Point" as const,
        coordinates: [
          parseFloat(restaurant.map_x),
          parseFloat(restaurant.map_y),
        ],
      },
    }));
    index.load(points);
    return index;
  }, [restaurants]);

  const clusters = useMemo(() => {
    if (!clusterData) return [];
    const zoom = Math.floor(scale * 1.5);
    return clusterData.getClusters([0, 0, 100, 100], zoom);
  }, [clusterData, scale]);

  return clusters;
};
