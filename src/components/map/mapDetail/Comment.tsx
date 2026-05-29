import { useState } from "react";
import { RestaurantType } from "@types";
import { useCommentMutations } from "@hooks";
import CommentItem from "./comment/CommentItem";
import NewCommentModal from "./comment/NewCommentModal";
import DeleteCommentModal from "./comment/DeleteCommentModal";

interface Props {
  restaurant: RestaurantType;
}

const Comment = ({ restaurant }: Props) => {
  const { id: restaurantId, name: restaurantName } = restaurant || {};
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );
  const { comments, userId, saveComment, deleteComment } =
    useCommentMutations(restaurantId);

  return (
    <div className="sm:pt-0 w-full mt-4">
      <div className="flex justify-between mb-2 mt-2 sm:mt-0">
        제출된 의견서 {comments.length}건
      </div>
      <div
        className="cursor-pointer bg-gray-100 flex justify-center p-2 rounded-md"
        onClick={() => setIsOpenModal(true)}
      >
        새 의견서 작성 →
      </div>
      {comments.length > 0 ? (
        <div className="border-t border-b border-gray-100 mt-2">
          {comments.map((comment) => {
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
