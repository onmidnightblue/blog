// 맛집 지도 일러스트

import Header from "@/src/components/layout/Header";
import Map from "@/src/components/Map";

const page = () => {
  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden">
      <Header />
      <main className="absolute top-0 left-0 w-full h-full">
        <Map />
      </main>
    </div>
  );
};

export default page;
