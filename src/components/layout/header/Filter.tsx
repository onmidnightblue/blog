import { DAY_LABELS } from "@constants";
import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const {
    categories,
    // selectedCategory,
    selectedCategories,
    toggleCategory,
    targetTimeFilter,
    setTargetTimeFilter,
    isRoomRequired,
    isCourseRequired,
    setFilter,
  } = useRestaurantStore((state) => state);

  const handleDayChange = (day: number) => {
    const currentTime = targetTimeFilter?.time || "12:00";
    setTargetTimeFilter({ day, time: currentTime });
  };

  const handleTimeChange = (time: string) => {
    const currentDay = targetTimeFilter?.day ?? new Date().getDay();
    setTargetTimeFilter({ day: currentDay, time });
  };

  return (
    <div className="bg-white p-4 border flex flex-col gap-4 h-full overflow-y-scroll">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">방문 시간</p>
        <div className="flex gap-2 overflow-x-auto relative [&::-webkit-scrollbar]:hidden">
          {DAY_LABELS.map((label, idx) => {
            const isActive = targetTimeFilter?.day === idx;
            return (
              <button
                key={label}
                onClick={() => handleDayChange(idx)}
                className={`${BADGE_BASE} ${
                  isActive ? BADGE_ACTIVE : BADGE_INACTIVE
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {/* <input
          type="time"
          step='1800'
          value={targetTimeFilter?.time || "11:30"}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full p-2 text-sm border border-foreground/30 rounded-md outline-none"
        /> */}
        <label htmlFor="appt-time">방문 시간: </label>
        <input id="appt-time" list="times" type="time" name="appt-time" value={targetTimeFilter?.time || "11:30"} onChange={(e) => handleTimeChange(e.target.value)} step="1800" />
        <datalist id="times">
          {Array.from({ length: 24 }, (_, i) => 
          `${String((i + 1) % 24).padStart(2, '0')}:00`
        ).map((time) => (
            <option key={`${time}:00`} value={time} />
          ))}
        </datalist>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">구비 요건</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("isRoomRequired", !isRoomRequired)}
            className={`${BADGE_BASE} ${
              isRoomRequired ? BADGE_ACTIVE : BADGE_INACTIVE
            }`}
          >
            룸
          </button>
          <button
            onClick={() => setFilter("isCourseRequired", !isCourseRequired)}
            className={`${BADGE_BASE} ${
              isCourseRequired ? BADGE_ACTIVE : BADGE_INACTIVE
            }`}
          >
            코스요리
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">메뉴</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleCategory("")}
            className={`${BADGE_BASE} ${
              selectedCategories.length === 0 ? BADGE_ACTIVE : BADGE_INACTIVE
            }`}
          >
            <span>전체</span>
          </button>
          {categories.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <button
                key={`panel-${category}`}
                onClick={() => toggleCategory(category)}
                className={`${BADGE_BASE} ${
                  isActive ? BADGE_ACTIVE : BADGE_INACTIVE
                }`}
              >
                <span className="break-keep">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// style
const BADGE_BASE =
  "px-2 py-1 rounded-md transition cursor-pointer text-sm select-none flex items-center gap-2";
const BADGE_ACTIVE = "bg-foreground text-white font-medium";
const BADGE_INACTIVE = "bg-gray-100 text-foreground-muted hover:bg-gray-200";

export default Filter;
