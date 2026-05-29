import { useComments, useExternalMap } from "@hooks";
import { RestaurantType } from "@types";
import { getOperatingHoursText } from "@utils";
import { useEffect, useState } from "react";
import Comment from "@components/comment/Comment";

interface Props {
  restaurant: RestaurantType;
}

const ViewComponent = ({ restaurant }: Props) => {
  const {
    id: restaurantId,
    name,
    status_number,
    is_visible,
    has_room,
    category,
    phone,
    land_address,
    keyword,
    map_x,
    map_y,
    operating_hours,
  } = restaurant;
  const { data: comments = [] } = useComments(restaurantId, false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const { openNaverMap, openKakaoMap } = useExternalMap();

  const getHighlightColor = (isError: boolean) =>
    isError ? "text-error" : "text-foreground";

  useEffect(() => {
    if (isOpenComment) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpenComment]);

  return (
    <>
      {isOpenComment && (
        <div className="fixed inset-0 z-999 bg-white transition-transform duration-300 transform translate-x-0 top-[86px] sm:top-[96px] left-[8px] sm:left-[16px] border h-[calc(100vh-92px)] flex flex-col sm:h-[calc(100vh-112px)] sm:w-120 w-[calc(100%-16px)]">
          <div className="flex items-center p-4 border-b">
            <button onClick={() => setIsOpenComment(false)} className="mr-4">
              <div className="w-0 h-0 border-y-7 border-r-9 border-t-transparent border-b-transparent" />
            </button>
            <h2 className="font-bold">{name}</h2>
          </div>
          <div className="p-4 overflow-y-scroll">
            <Comment restaurant={restaurant} />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <h3 className="font-bold">{name}</h3>
        <div className="flex gap-2">
          <button
            className="text-xs text-green-700 cursor-pointer"
            onClick={() => openNaverMap(restaurant.name)}
          >
            NAVER
          </button>
          <button
            className="text-xs text-yellow-500 cursor-pointer"
            onClick={() => openKakaoMap(restaurant.name)}
          >
            KAKAO
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <span
          className={`${getHighlightColor(status_number !== "01")} ${S_DOT}`}
        >
          {status_number === "01" ? "운영" : "폐업"}
        </span>
        <span
          className={`${getHighlightColor(!is_visible)} ${
            has_room ? S_DOT : ""
          }`}
        >
          {is_visible ? "표시함" : "표시안함"}
        </span>
        {has_room && <span>룸 보유</span>}
      </div>
      <div className="flex items-center">
        <span
          className={`${
            category ? "text-foreground" : "text-placeholder"
          } ${S_DOT}`}
        >
          {category || "카테고리"}
        </span>
        <span className={phone ? "text-foreground" : "text-placeholder"}>
          {phone || "전화번호"}
        </span>
      </div>
      <div className={land_address ? "text-foreground" : "text-placeholder"}>
        {land_address || "주소"}
      </div>
      {keyword && (
        <div
          className={`${
            keyword ? "text-foreground" : "text-placeholder"
          } flex gap-1 items-center w-full overflow-x-auto flex-nowrap whitespace-nowrap  py-1 [&::-webkit-scrollbar]:hidden sm:flex-wrap`}
        >
          {keyword.split(" ").map((word, index) => (
            <span
              key={`map-detail-keyword-${index}`}
              className="text-sm bg-gray-100 px-1 rounded shrink-0"
            >
              {word}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center">
        <span
          className={`${S_DOT} ${
            map_x ? "text-foreground" : "text-placeholder"
          }`}
        >
          {map_x || "X좌표"}
        </span>
        <span className={`${map_y ? "text-foreground" : "text-placeholder"}`}>
          {map_y || "Y좌표"}
        </span>
      </div>
      <div
        className={`${
          operating_hours?.length ? "text-foreground" : "text-placeholder"
        }`}
      >
        {getOperatingHoursText(operating_hours) || "운영시간"}
      </div>
      <div className="flex justify-end">
        <button
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setIsOpenComment(true)}
        >
          의견서 {(comments || []).length}건
          <div className="w-0 h-0 border-y-5 border-l-7 border-t-transparent border-b-transparent" />
        </button>
      </div>
    </>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-[10px] after:-right-2 after:rounded-full after:bg-gray-400";

export default ViewComponent;
