"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Header from "@components/layout/Header";
import List from "@components/list/List";
import Map from "@components/map/Map";
import { Suspense } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const view = searchParams.get("view") || "map";
  const isListView = view === "list";

  const toggleView = (targetView: "list" | "map") => {
    router.push(`/assembly-dining?view=${targetView}`);
  };

  return (
    <Suspense
      fallback={
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-full animate-pulse">
          <div className="w-12 h-12 mb-4 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
        </div>
      }
    >
      <div className={`w-full ${isListView ? "" : "overflow-hidden h-dvh"}`}>
        <Header
          isListView={isListView}
          toggleView={(isList) => toggleView(isList ? "list" : "map")}
        />
        {isListView ? <List /> : <Map />}
      </div>
    </Suspense>
  );
};

export default Page;
