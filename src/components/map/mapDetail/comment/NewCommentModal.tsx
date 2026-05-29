import { InnerInput, Modal, SmallLoadingSpinner } from "@components/common";
import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; password: string }) => Promise<void>;
  userId: number | null;
  restaurantName: string;
}

const NewCommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  restaurantName,
}: Props) => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReset = () => {
    onClose();
    setText("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPosting) return;
    if (!text.trim()) return setError("내용을 입력해주세요.");
    if (password.length < 4) return setError("4자리 비밀번호를 입력해주세요.");

    setIsPosting(true);
    try {
      await onSubmit({ text, password });
      handleReset();
    } catch {
      setError("제출에 실패했습니다.");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <Modal title={"의견서 서식"} isOpen={isOpen} closeModal={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="flex border">
            <div className="flex-1 border-r px-2 py-1">작성자명</div>
            <div className="flex-2 px-2 py-1">익명의주무관{userId}</div>
          </div>
          <div className="flex border border-t-0">
            <div className="flex-1 border-r px-2 py-1">비밀번호</div>
            <div className="flex-2 px-2 py-1">
              <InnerInput
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
                disabled={isPosting}
              />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            rows={5}
            className="block border border-t-0 w-full p-4 resize-none outline-none disabled:cursor-not-allowed focus:border-foreground"
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            disabled={isPosting}
            placeholder={`${restaurantName}에 대한 의견을 작성해주세요.`}
            value={text}
          />
        </div>
        {error && (
          <div className="mt-0.5 text-error font-medium leading-none">
            {error}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPosting}
            className="py-2 px-4 rounded-lg bg-gray-50 text-gray-500"
          >
            다음에 작성
          </button>
          <button
            type="submit"
            disabled={!text.trim() || password.length < 4 || isPosting}
            className="py-2 px-4 bg-black rounded-lg text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
          >
            {isPosting ? <SmallLoadingSpinner /> : "제출"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewCommentModal;
