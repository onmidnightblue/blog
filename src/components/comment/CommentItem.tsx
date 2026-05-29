import { CommentType } from "@types";
import { formatKoreanDate } from "@utils";

interface Props {
  restaurantId: string;
  comment: CommentType;
  setDeleteTargetId: (id: string | number) => void;
}

const CommentItem = ({ setDeleteTargetId, comment }: Props) => {
  const { id: commentId, content, user_id, created_at } = comment;

  return (
    <div className="py-2">
      <div className="flex justify-between text-sm text-gray-400">
        <div className="flex gap-1">
          <div>익명의주무관{user_id} |</div>
          <div>{formatKoreanDate(created_at)}</div>
        </div>
        <button
          className="cursor-pointer"
          onClick={() => setDeleteTargetId(commentId)}
        >
          삭제
        </button>
      </div>
      <div className="whitespace-pre-wrap break-all">{content}</div>
    </div>
  );
};

export default CommentItem;
