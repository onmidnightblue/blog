import type { BoardPost } from "@types";
import BoardListItem from "./BoardListItem";

interface Props {
  posts: BoardPost[];
}

const BoardList = ({ posts }: Props) => {
  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.id}>
          <BoardListItem post={post} />
        </li>
      ))}
    </ul>
  );
};

export default BoardList;
