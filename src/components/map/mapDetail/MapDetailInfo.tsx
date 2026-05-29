import { RestaurantType } from "@types";
import { getOperatingHoursText } from "@utils";

interface Props {
  restaurant: RestaurantType;
}

const MapDetailInfo = ({ restaurant }: Props) => {
  const {
    status_number,
    has_room,
    category,
    phone,
    land_address,
    operating_hours,
  } = restaurant || {};

  const OperatingArray = operating_hours
    ? getOperatingHoursText(operating_hours).split(" / ")
    : [];

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        {status_number !== "01" && (
          <span className={`text-error ${S_DOT}`}>폐업</span>
        )}
        <span
          className={`${
            category ? "text-foreground" : "text-placeholder"
          } ${S_DOT}`}
        >
          {category || "카테고리"}
        </span>
        <span
          className={`${phone ? "text-foreground" : "text-placeholder"} ${
            has_room ? S_DOT : ""
          }`}
        >
          {phone || "전화번호"}
        </span>
        {has_room && <span>룸</span>}
      </div>
      <div className={land_address ? "text-foreground" : "text-placeholder"}>
        {land_address || "주소"}
      </div>
      {OperatingArray.length && (
        <div
          className={`${
            OperatingArray.length ? "text-foreground" : "text-placeholder"
          }`}
        >
          {OperatingArray.length
            ? OperatingArray.map((item, index) => {
                const [date, time, ...rest] = item.split(" ");
                return (
                  <div
                    key={`map-detail-operation-${index}`}
                    className="flex gap-2"
                  >
                    <div className="min-w-10">{date}</div>
                    <div>{time}</div>
                    <div>{rest}</div>
                  </div>
                );
              })
            : "운영시간"}
        </div>
      )}
    </div>
  );
};

// style
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-[10px] after:-right-2 after:rounded-full after:bg-gray-400";

export default MapDetailInfo;
