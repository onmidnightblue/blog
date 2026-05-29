import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({ title, children, isOpen, closeModal }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-9999 transition-all ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div
        className={
          "relative z-10 grid grid-rows-[max-content_1fr_max-content] w-full max-w-lg p-6 overflow-hidden bg-white max-h-5/6 rounded-xl"
        }
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
