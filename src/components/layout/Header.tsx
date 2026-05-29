"use client";

import { useState } from "react";
import Search from "./header/Search";
import { FilterIcon, ListIcon, MapIcon } from "@assets";
import Filter from "./header/Filter";

interface Props {
  isListView: boolean;
  toggleView: (param: boolean) => void;
}

const Header = ({ isListView, toggleView }: Props) => {
  const [isOpenPanel, setIsOpenPanel] = useState(false);

  const togglePanelHandler = () => {
    setIsOpenPanel((prev) => !prev);
  };

  return (
    <header
      className={`${
        isListView ? "sticky top-0" : "fixed top-0 left-0"
      } flex justify-between z-9999 w-full`}
    >
      <div className={`flex flex-col p-2 sm:p-4 w-full overflow-hidden`}>
        <div className="flex gap-1 sm:w-120 w-[calc(100%-38px)] relative">
          <div className="flex items-center gap-4 p-4 bg-white border border-foreground pointer-events-auto w-full">
            <h1 className="flex flex-col sm:flex-row leading-[17px] text-xl sm:text-2xl font-bold text-foreground font-paperozi">
              <span className="break-keep">국회</span>
              <span className="break-keep">밥안</span>
            </h1>
            <Search />
          </div>
          <button
            onClick={togglePanelHandler}
            className={`items-center h-18.5 p-2 bg-white border border-foreground flex justify-center pointer-events-auto cursor-pointer`}
          >
            <FilterIcon
              className={`transition ${isOpenPanel ? "fill-blue-500" : ""}`}
            />
          </button>
        </div>
        <div
          className={`absolute top-22 sm:top-24 sm:left-4 transition-all ease-in-out z-99
            sm:w-120 w-[calc(100%-16px)]
    ${
      isOpenPanel
        ? "opacity-100 visible translate-y-0"
        : "opacity-0 invisible -translate-y-2"
    }`}
        >
          <div className="overflow-hidden sm:h-[calc(100vh-112px)] h-[calc(100vh-96px)]">
            <Filter />
          </div>
        </div>
      </div>
      <div className="fixed right-0 top-0 p-2 sm:p-4 w-auto flex flex-col gap-1.5 justify-around z-99">
        <button
          className={`${viewIconStyle} ${
            isListView ? "bg-white" : "bg-foreground"
          }`}
          onClick={() => toggleView(false)}
        >
          <MapIcon className={isListView ? "fill-foreground" : "fill-white"} />
        </button>
        <button
          className={`${viewIconStyle} ${
            isListView ? "bg-foreground" : "bg-white"
          }`}
          onClick={() => toggleView(true)}
        >
          <ListIcon className={isListView ? "fill-white" : "fill-foreground"} />
        </button>
      </div>
    </header>
  );
};

// style
const viewIconStyle = `border pointer-events-auto cursor-pointer flex items-center justify-center p-1`;

export default Header;
