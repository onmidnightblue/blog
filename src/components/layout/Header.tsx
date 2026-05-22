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
    <>
      <header className="fixed flex flex-col top-0 left-1/2 -translate-x-1/2 z-9999 p-4 pointer-events-none w-full sm:w-4/5 sm:max-w-150">
        <div className="flex gap-1">
          <div className="flex items-center gap-4 p-4 bg-white border border-black pointer-events-auto w-full">
            <h1 className="text-2xl font-bold text-foreground font-paperozi break-keep">
              국회밥안
            </h1>
            <Search />
          </div>
          <div
            onClick={togglePanelHandler}
            className={`items-center h-18.5 p-2 bg-white border border-black flex justify-center pointer-events-auto cursor-pointer`}
          >
            <FilterIcon
              className={`transition duration-300 ${
                isOpenPanel ? "fill-blue-500" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out z-9999 ${
            isOpenPanel
              ? "grid-rows-[1fr] opacity-100 mt-1 pointer-events-auto"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <Filter />
        </div>
      </header>
      <div className="fixed right-0 top-0 p-4 w-auto flex flex-col gap-1 justify-around z-9999">
        <div
          className={`${viewIconStyle} ${isListView ? "" : "bg-foreground"}`}
          onClick={() => toggleView(false)}
        >
          <MapIcon className={isListView ? "" : "stroke-white"} />
        </div>
        <div
          className={`${viewIconStyle} ${isListView ? "bg-foreground" : ""}`}
          onClick={() => toggleView(true)}
        >
          <ListIcon className={isListView ? "stroke-white" : ""} />
        </div>
      </div>
    </>
  );
};

// style
const viewIconStyle = `border bg-white pointer-events-auto cursor-pointer flex items-center justify-center p-1`;

export default Header;
