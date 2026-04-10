import Header from "@/src/components/layout/Header";
import Map from "@/src/components/map/Map";

const page = () => {
  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden">
      <Header />
      <main className="w-full h-full flex items-center justify-center">
        <Map />
      </main>
    </div>
  );
};

export default page;
