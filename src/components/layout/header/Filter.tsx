import { DAY_LABELS } from "@constants";
import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const {
    categories,
    selectedCategories,
    toggleCategory,
    targetTimeFilter,
    setTargetTimeFilter,
    isRoomRequired,
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
    <div className="flex flex-col gap-8 overflow-hidden bg-white p-4 border">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">종류</p>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <div
                key={`panel-${category}`}
                onClick={() => toggleCategory(category)}
                className={`px-2 rounded-md transition cursor-pointer
                ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-foreground-muted"
                }
                `}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">방문시간</p>
        <div className="flex gap-1 overflow-x-auto relative">
          {DAY_LABELS.map((label, idx) => {
            const isActive = targetTimeFilter?.day === idx;
            return (
              <div
                key={label}
                onClick={() => handleDayChange(idx)}
                className={`px-2 rounded-md transition cursor-pointer
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-100 text-foreground-muted"
                  }
                  `}
              >
                {label}
              </div>
            );
          })}
          {targetTimeFilter && (
            <div
              onClick={() => setTargetTimeFilter(null)}
              className="text-blue-500 absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              초기화
            </div>
          )}
        </div>
        <input
          type="time"
          value={targetTimeFilter?.time || "12:00"}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full p-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground-muted">룸</p>
        <div className="flex flex-wrap gap-2">
          <div
            onClick={() => setFilter("isRoomRequired", false)}
            className={`px-2 rounded-md transition cursor-pointer
                  ${
                    !isRoomRequired
                      ? "bg-black text-white"
                      : "bg-gray-100 text-foreground-muted"
                  }
                  `}
          >
            전체
          </div>
          <div
            onClick={() => setFilter("isRoomRequired", true)}
            className={`px-2 rounded-md transition cursor-pointer
                  ${
                    isRoomRequired
                      ? "bg-black text-white"
                      : "bg-gray-100 text-foreground-muted"
                  }
                  `}
          >
            보유
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
