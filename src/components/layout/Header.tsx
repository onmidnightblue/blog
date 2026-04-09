import Clock from "./header/Clock";
import Filter from "./header/Filter";
import Search from "./header/Search";

const Header = () => {
  return (
    <header className="w-full flex justify-between gap-4">
      <div className="flex flex-col gap-4 p-4 m-4 bg-white z-10">
        <h1 className="font-bold text-4xl font-paperozi">국회밥안</h1>
        <Search />
        <Filter />
      </div>
      <div className="p-4 m-4 bg-white z-10 h-fit">
        <Clock />
      </div>
    </header>
  );
};

export default Header;
