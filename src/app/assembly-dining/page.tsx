"use client";

import { useState } from "react";
import Header from "src/components/layout/Header";
import List from "src/components/list/List";
import Map from "src/components/map/Map";

const Page = () => {
  const [isListView, setIsListView] = useState(false);

  const toggleView = (toggle: boolean) => {
    setIsListView(toggle);
  };

  return (
    <div
      className={`flex flex-col w-full ${
        isListView ? "" : "overflow-hidden h-dvh"
      }`}
    >
      <Header isListView={isListView} toggleView={toggleView} />
      {isListView ? <List /> : <Map />}
    </div>
  );
};

export default Page;
