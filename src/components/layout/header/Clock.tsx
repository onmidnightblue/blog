"use client";

import { ClockIcon } from "@/src/assets/svgs";
import { useCurrentTime } from "@/src/hooks/useCurrentTime";

const Clock = () => {
  const { year, month, date, hh, mm, ss } = useCurrentTime();
  const isRenderTime = year && month && date && hh && mm && ss;
  const timeClassName = "tabular-nums animate-slide-up inline-block";

  return isRenderTime ? (
    <div className="font-medium">
      <p className="text-lg animate-slide-up">
        {year}. {month}. {date}
      </p>
      <p className="text-md text-right">
        <span key={`hour-${hh}`} className={timeClassName}>
          {hh}
        </span>
        :
        <span key={`min-${mm}`} className={timeClassName}>
          {mm}
        </span>
        :
        <span key={`sec-${ss}`} className={timeClassName}>
          {ss}
        </span>
      </p>
    </div>
  ) : (
    <div className="h-13 w-30 rounded-lg flex justify-center items-center">
      <ClockIcon />
    </div>
  );
};

export default Clock;
