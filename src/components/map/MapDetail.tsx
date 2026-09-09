import { RestaurantType } from "@types";
import { useCallback, useEffect, useState } from "react";
import MapDetailList from "./mapDetail/MapDetailList";
import MapDetailInfo from "./mapDetail/MapDetailInfo";
import Comment from "@components/comment/Comment";
import { useComments, useExternalMap } from "@hooks";

interface Props {
  selectedRestaurants: RestaurantType[];
  activeRestaurantIdx: number;
  onClose: () => void;
  setActiveRestaurantIdx: (index: number) => void;
}

const MapDetail = ({
  selectedRestaurants,
  activeRestaurantIdx,
  onClose,
  setActiveRestaurantIdx,
}: Props) => {
  const restaurant = selectedRestaurants[activeRestaurantIdx];
  const { id: restaurantId, name, keyword } = restaurant || {};
  const { data: comments = [] } = useComments(restaurantId, true);
  const [isVisible, setIsVisible] = useState(false);
  const { openNaverMap, openKakaoMap } = useExternalMap();
  const [isOpenComment, setIsOpenComment] = useState(false);


  const handleCloseAnimation = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseAnimation();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseAnimation]);

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
      <div className="fixed inset-0 z-999 bg-white transition-transform duration-300 transform translate-x-0 top-22 sm:top-24 sm:left-4 left-2 border sm:h-[calc(100dvh-112px)] h-[calc(100dvh-96px)] flex flex-col sm:w-120 w-[calc(100%-16px)]">
        <div className="flex items-center px-4 py-3 sm:px-4 border-b">
          <button className='flex items-center gap-2' onClick={() => setIsOpenComment(false)}>
            <div className="w-0 h-0 border-y-7 border-r-9 border-t-transparent border-b-transparent" />
            <h2 className="font-bold">{name}</h2>
          </button>
        </div>
        <div className="p-4 overflow-y-scroll">
          <Comment restaurant={restaurant} />
        </div>
      </div>
    )}
    <div
      className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-100 flex flex-col gap-2 transition-all ease-in-out max-h-[calc(100%-94px)] sm:max-h-[calc(100%-162px)] sm:w-[calc(100%-2rem)] w-[calc(100%-1rem)] pointer-events-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-white border p-4 sm:p-6 flex flex-col gap-4 overflow-hidden w-full sm:w-120 pointer-events-auto">
        <div className="flex gap-2 justify-between items-start relative">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold leading-tight mr-2 inline-block">
              {name}
            </h2>
            <button
              className="text-xs text-green-700 cursor-pointer mr-2"
              onClick={() => openNaverMap(name)}
            >
              NAVER
            </button>
            <button
              className="text-xs text-yellow-500 cursor-pointer"
              onClick={() => openKakaoMap(name)}
            >
              KAKAO
            </button>
          </div>
          <button
            onClick={handleCloseAnimation}
            className="cursor-pointer flex items-center justify-center text-sm flex-col font-bold"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-1 w-full">
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
            <MapDetailInfo restaurant={restaurant} />
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
        </div>
      </div>
      {selectedRestaurants.length > 1 && (
        <MapDetailList
          activeRestaurantIdx={activeRestaurantIdx}
          selectedRestaurants={selectedRestaurants}
          selectedHandler={(index) => {
            setActiveRestaurantIdx(index);
          }}
        />
      )}
    </div>
    </>
  );
};

export default MapDetail;
