"use client";

import { useEffect, useState } from "react";

export const useCurrentTime = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return {
      year: "",
      month: "",
      date: "",
      hh: "",
      mm: "",
      ss: "",
      isMounted: false,
    };
  }

  return {
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    date: String(now.getDate()).padStart(2, "0"),
    hh: String(now.getHours()).padStart(2, "0"),
    mm: String(now.getMinutes()).padStart(2, "0"),
    ss: String(now.getSeconds()).padStart(2, "0"),
    isMounted: true,
  };
};
