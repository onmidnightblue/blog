import { useMemo } from "react";
import { DAY_LABELS, TIME_FIELDS, TIME_REGEX } from "@constants";
import { OperatingHourType, RestaurantType, SupabaseValue } from "@types";
import { InnerInput } from "@components/common";

interface Props {
  restaurant: RestaurantType;
  errorId: string | number | null | undefined;
  errorMessage: string | null;
  fieldKey?: string | null;
  updateFormData: (updateData: Record<string, SupabaseValue>) => void;
}

const EditOperatingHour = ({
  restaurant,
  errorId,
  fieldKey,
  errorMessage,
  updateFormData,
}: Props) => {
  const { operating_hours } = restaurant || {};
  const displayHours = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, i) =>
        operating_hours?.find((oh) => oh.day_of_week === i) ||
        ({ id: i, day_of_week: i, is_off: false } as OperatingHourType)
    );
  }, [operating_hours]);

  const getDayColor = (day: number) => {
    if (day === 5) return "text-blue-400";
    if (day === 6) return "text-red-500";
    return "text-gray-600";
  };

  const handleHourChange = (
    dayOfWeek: number,
    data: Partial<OperatingHourType>
  ) => {
    const updatedHours = displayHours.map((oh) =>
      oh.day_of_week === dayOfWeek ? { ...oh, ...data } : oh
    );
    updateFormData({
      operating_hours: updatedHours as unknown as SupabaseValue,
    });
  };

  return (
    <div className="grid gap-2">
      {displayHours.map((oh, index) => (
        <div
          key={`operating-row-${oh.day_of_week}`}
          className="grid grid-cols-[20px_7fr_1fr] gap-2 items-end"
        >
          <div className={`text-sm ${getDayColor(oh.day_of_week)}`}>
            {DAY_LABELS[oh.day_of_week]}
          </div>
          {oh.is_off ? (
            <div className="w-full text-center text-error bg-red-50">
              CLOSED
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(5,1fr)] items-end gap-2">
              {TIME_FIELDS.map((field) => {
                const isErrorField =
                  errorId === oh.id &&
                  (fieldKey === field.key || fieldKey === null);
                return (
                  <div key={`${oh.id}-${field.key}`} className="flex flex-col">
                    <span className="text-[9px] text-gray-400 uppercase">
                      {field.label}
                    </span>
                    <InnerInput
                      type="text"
                      key={`input-${oh.id}-${field.key}`}
                      value={
                        (oh[field.key as keyof OperatingHourType] as string) ||
                        ""
                      }
                      placeholder={field.placeholder}
                      error={isErrorField ? errorMessage : ""}
                      onChange={(value) =>
                        handleHourChange(oh.day_of_week, { [field.key]: value })
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-2 items-center text-blue-400">
            <button
              onClick={() =>
                handleHourChange(oh.day_of_week, { is_off: !oh.is_off })
              }
              className={`text-sm cursor-pointer 
                    ${oh.is_off ? "text-error" : ""}
                    `}
            >
              {oh.is_off ? "ON" : "OFF"}
            </button>
            {index > 0 && !oh.is_off && (
              <button
                onClick={() =>
                  handleHourChange(oh.day_of_week, {
                    open_time: displayHours[index - 1].open_time,
                    close_time: displayHours[index - 1].close_time,
                    break_start: displayHours[index - 1].break_start,
                    break_end: displayHours[index - 1].break_end,
                    last_order: displayHours[index - 1].last_order,
                    is_off: displayHours[index - 1].is_off,
                  })
                }
                className="text-sm cursor-pointer"
              >
                SAME
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditOperatingHour;
