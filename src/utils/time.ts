import { DAY_LABELS } from "@constants";
import { OperatingHourType } from "@types";

export const getOperatingHoursText = (hours: OperatingHourType[]) => {
  if (!hours || hours.length === 0) return "";

  const dayMap = new Map<number, string>();
  hours.forEach((oh) => {
    let text = "휴무";
    if (!oh.is_off && oh.open_time) {
      const open = oh.open_time.substring(0, 5);
      const close = oh.close_time?.substring(0, 5) || "";
      const lastOrder = oh.last_order?.substring(0, 5);
      text = `${open}~${close}${lastOrder ? ` (주문마감 ${lastOrder})` : ""}`;
    }
    dayMap.set(oh.day_of_week, text);
  });

  const allTimes = Array.from(dayMap.values());
  if (dayMap.size === 7 && allTimes.every((t) => t === allTimes[0])) {
    return `매일 ${allTimes[0]}`;
  }

  const result: string[] = [];
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  let i = 0;

  while (i < dayOrder.length) {
    const startDay = dayOrder[i];
    const currentTime = dayMap.get(startDay);

    if (currentTime === undefined) {
      i++;
      continue;
    }

    let j = i + 1;
    while (j < dayOrder.length && dayMap.get(dayOrder[j]) === currentTime) {
      j++;
    }

    const group = dayOrder.slice(i, j);
    result.push(`${formatDayGroup(group)} ${currentTime}`);
    i = j;
  }

  return result.join(" / ");
};

const formatDayGroup = (days: number[]) => {
  const getLabel = (d: number) => DAY_LABELS[d];

  const isWeekday = days.length === 5 && days.every((d) => d >= 1 && d <= 5);
  const isWeekend = days.length === 2 && days.includes(6) && days.includes(0);

  if (isWeekday) return "평일";
  if (isWeekend) return "주말";

  if (days.length === 1) return getLabel(days[0]);

  return `${getLabel(days[0])}~${getLabel(days[days.length - 1])}`;
};
