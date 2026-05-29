import { useState } from "react";
import { RestaurantType, CommentType } from "@types";
import { useCommentMutations, useComments } from "@hooks";
import CommentItem from "./CommentItem";
import NewCommentModal from "./NewCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";

interface Props {
  restaurant: RestaurantType;
}

const Comment = ({ restaurant }: Props) => {
  const { id: restaurantId, name: restaurantName } = restaurant || {};
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );
  const { userId, saveComment, deleteComment } =
    useCommentMutations(restaurantId);
  const { data: comments = [] } = useComments(restaurantId, false);

  return (
    <div className="w-full">
      <button
        className="w-full cursor-pointer bg-gray-100 flex justify-center items-center gap-2 p-2 rounded-md"
        onClick={() => setIsOpenModal(true)}
      >
        새 의견서 작성
        <div className="w-0 h-0 border-y-5 border-l-7  border-t-transparent border-b-transparent" />
      </button>
      {(comments || []).length > 0 ? (
        <div className="border-t border-b border-gray-100 mt-2">
          {comments.map((comment: CommentType) => {
            return (
              <CommentItem
                key={`comment-${restaurantId}-${comment.id}`}
                restaurantId={restaurantId}
                comment={comment}
                setDeleteTargetId={(id: string | number) =>
                  setDeleteTargetId(id)
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="pt-7 pb-4 flex justify-center text-center text-gray-400">
          아직 접수된 의견서가 없습니다.
          <br />첫 번째 의견서를 제출해 주세요!
        </div>
      )}
      <NewCommentModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={saveComment}
        userId={userId}
        restaurantName={restaurantName}
      />
      <DeleteCommentModal
        commentId={deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onDelete={deleteComment}
      />
    </div>
  );
};

export default Comment;
