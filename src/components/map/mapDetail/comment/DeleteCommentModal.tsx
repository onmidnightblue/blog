import { InnerInput, Modal, SmallLoadingSpinner } from "@components/common";
import { useState } from "react";

interface Props {
  commentId: string | number | null;
  onClose: () => void;
  onDelete: (data: {
    commentId: string | number;
    password: string;
  }) => Promise<void>;
}

const DeleteCommentModal = ({ commentId, onClose, onDelete }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReset = () => {
    onClose();
    setPassword("");
    setError("");
  };

  const handleDelete = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDeleting) return;
    if (!commentId) return;
    if (password.length < 4) return setError("비밀번호 4자리를 입력해주세요.");
    setIsDeleting(true);
    try {
      await onDelete({ commentId, password });
      handleReset();
    } catch {
      setError("비밀번호가 일치하지 않습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal title="의견서 파기" isOpen={!!commentId} closeModal={onClose}>
      <form onSubmit={handleDelete} className="flex flex-col gap-4">
        <p>작성 시 입력한 4자리 비밀번호를 입력해주세요.</p>
        <div className="flex border">
          <div className="flex-1 border-r px-2 py-1">비밀번호</div>
          <div className="flex-2 px-2 py-1">
            <InnerInput
              autoFocus
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              label="4자리의 숫자"
              value={password}
              onChange={(v) => {
                const numericValue = v.replace(/[^0-9]/g, "");
                setPassword(numericValue);
                if (error) setError("");
              }}
              placeholder="4자리의 숫자"
            />
          </div>
        </div>
        {error && <p className="text-error">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-6 rounded-lg bg-gray-100 text-gray-500"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isDeleting}
            className="py-2 px-6 bg-error text-white rounded-lg"
          >
            {isDeleting ? <SmallLoadingSpinner isWhite={true} /> : "파기"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteCommentModal;
