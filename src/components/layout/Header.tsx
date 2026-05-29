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
        isListView ? "" : "fixed top-0 left-0"
      } flex justify-between z-9999 pointer-events-none`}
    >
      <div className={`flex flex-col p-4 w-[calc(100%-38px)]`}>
        <div className="flex gap-1 sm:w-120">
          <div className="flex items-center gap-4 p-4 bg-white border border-foreground pointer-events-auto w-full">
            <h1 className="text-2xl font-bold text-foreground font-paperozi break-keep">
              국회밥안
            </h1>
            <Search />
          </div>
          <div
            onClick={togglePanelHandler}
            className={`items-center h-18.5 p-2 bg-white border border-foreground flex justify-center pointer-events-auto cursor-pointer`}
          >
            <FilterIcon
              className={`transition ${isOpenPanel ? "fill-blue-500" : ""}`}
            />
          </div>
        </div>
        <div
          className={`grid transition-all ease-in-out z-9999 sm:w-120 overflow-hidden ${
            isOpenPanel
              ? "grid-rows-[1fr] opacity-100 pointer-events-auto mt-1"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <Filter />
          </div>
        </div>
      </div>
      <div className="fixed right-0 top-0 p-4 w-auto flex flex-col gap-1.5 justify-around z-9999">
        <div
          className={`${viewIconStyle} ${
            isListView ? "bg-white" : "bg-foreground"
          }`}
          onClick={() => toggleView(false)}
        >
          <MapIcon className={isListView ? "fill-foreground" : "fill-white"} />
        </div>
        <div
          className={`${viewIconStyle} ${
            isListView ? "bg-foreground" : "bg-white"
          }`}
          onClick={() => toggleView(true)}
        >
          <ListIcon className={isListView ? "fill-white" : "fill-foreground"} />
        </div>
      </div>
    </header>
  );
};

// style
const viewIconStyle = `border pointer-events-auto cursor-pointer flex items-center justify-center p-1`;

export default Header;
