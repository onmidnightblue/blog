import BoardFeed from "@components/board/BoardFeed";
import BoardHeader from "@components/board/BoardHeader";

const page = () => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="px-4 md:px-12 py-4 sm:py-6 md:py-8 mx-auto">
        <BoardHeader />
        <BoardFeed />
      </div>
    </div>
  );
};

export default page;
