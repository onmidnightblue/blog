import BoardFeed from "@components/board/BoardFeed";
import BoardHeader from "@components/board/BoardHeader";
import PageShell from "@components/layout/PageShell";

const page = () => {
  return (
    <PageShell>
      <BoardHeader />
      <BoardFeed />
    </PageShell>
  );
};

export default page;
