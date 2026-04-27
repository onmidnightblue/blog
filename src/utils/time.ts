import { OperatingHour } from "@types";

export const getOperatingHoursText = (hours: OperatingHour[]) => {
  if (!hours || hours.length === 0) return "";
  const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
  const sortedHours = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);
  const groups: Record<string, number[]> = {};

  sortedHours.forEach((oh) => {
    const timeKey =
      oh.is_off || !oh.open_time
        ? "휴무"
        : `${oh.open_time.substring(0, 5)} ~ ${oh.close_time?.substring(0, 5)}`;

    if (!groups[timeKey]) groups[timeKey] = [];
    groups[timeKey].push(oh.day_of_week);
  });

  const result = Object.entries(groups).map(([time, days]) => {
    const dayText =
      days.length === 7
        ? "매일"
        : days.length >= 5 &&
          days[1] - days[0] === 1 &&
          days[days.length - 1] === 5 &&
          days[0] === 1
        ? "평일"
        : days.length === 2 && days.includes(0) && days.includes(6)
        ? "주말"
        : days.map((d) => DAY_LABELS[d]).join(", ");

    return `${dayText} ${time}`;
  });

  return result.join(" / ");
};
