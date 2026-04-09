import { SearchIcon } from "@/src/assets/svgs";

const Search = () => {
  return (
    <div className="h-10 relative">
      <label className="absolute top-1/2 -translate-y-1/2 left-2">
        <SearchIcon className="size-5" />
      </label>
      <input
        type="text"
        className="w-full h-full border border-gray-300 focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200 p-2 pl-8"
        placeholder="부대찌개"
      />
    </div>
  );
};

export default Search;
