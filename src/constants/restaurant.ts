export const TIME_FIELDS = [
  { key: "open_time", label: "Open", placeholder: "11:00" },
  { key: "close_time", label: "Close", placeholder: "20:00" },
  { key: "last_order", label: "Last Order", placeholder: "19:30" },
  { key: "break_start", label: "Break Start", placeholder: "15:00" },
  { key: "break_end", label: "Break End", placeholder: "17:00" },
];

export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
