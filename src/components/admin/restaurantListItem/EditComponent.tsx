import { useMemo } from "react";
import { OperatingHourType, RestaurantType, SupabaseValue } from "@types";
import EditOperatingHour from "./EditOperatingHour";
import EditBasicInfo from "./EditBasicInfo";

interface Props {
  restaurant: RestaurantType;
  operatingHours: OperatingHourType[];
  errorMessage: string | null;
  errorId: string | number | null;
  saveToSupabase: (updateData: Record<string, SupabaseValue>) => void;
  saveOperatingHours: (payload: {
    id: number;
    data: Partial<OperatingHourType>;
  }) => void;
  saveOperatingHoursDirect: (payload: {
    id: number;
    data: Partial<OperatingHourType>;
  }) => void;
}

const EditComponent = ({
  restaurant,
  operatingHours,
  errorId,
  errorMessage,
  saveToSupabase,
  saveOperatingHours,
  saveOperatingHoursDirect,
}: Props) => {
  const displayHours = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, i) =>
        operatingHours.find((oh) => oh.day_of_week === i) ||
        ({ id: i, day_of_week: i, is_off: false } as OperatingHourType)
    );
  }, [operatingHours]);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text");
    const xMatch = pasteData.match(/[xX]\s*[::]?\s*([0-9.]+)/);
    const yMatch = pasteData.match(/[yY]\s*[::]?\s*([0-9.]+)/);
    if (xMatch && yMatch) {
      e.preventDefault();
      saveToSupabase({
        map_x: xMatch[1],
        map_y: yMatch[1],
      });
    }
  };

  return (
    <div onPaste={handlePaste} className="flex flex-col gap-2">
      <EditBasicInfo
        restaurant={restaurant}
        errorId={errorId}
        errorMessage={errorMessage}
        saveToSupabase={saveToSupabase}
      />
      <EditOperatingHour
        displayHours={displayHours}
        errorId={errorId}
        errorMessage={errorMessage}
        onUpdate={saveOperatingHours}
        onDirectUpdate={saveOperatingHoursDirect}
      />
    </div>
  );
};

export default EditComponent;
