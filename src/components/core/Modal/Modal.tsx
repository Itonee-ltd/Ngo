import { ReactNode } from "react";
import { Icon } from "@iconify/react";
import "./Modal.css";

interface ModalProps {
  closeModal?: () => void;
  className?: string;
  authModal?: boolean;
  styles?: string;
  children: ReactNode;
  title?: string | ReactNode;
  position: "modal-right" | "modal-center";
  width?: string;
  footerContent?: ReactNode;
}

export const Modal = ({
  children,
  title,
  className,
  styles,
  width,
  closeModal,
  authModal = false,
  position,
  footerContent,
}: ModalProps) => {
  const close = () => {
    closeModal && closeModal();
  };

  return (
    <div className="overflow-hidden">
      <div className="z-[500] overlay"></div>
      <div
        className={`modal ${position} ${width ?? "w-[398px]"} ${styles ?? ""} ${
          position === "modal-center"
            ? "h-auto max-h-[90vh]"
            : "h-full overflow-hidden mb-12 flex flex-col"
        }`}
      >
        <div
          className={`flex flex-col ${
            position === "modal-center" ? "h-auto" : "h-full"
          } ${className ?? ""} ${!authModal ? "bg-white w-full" : ""} ${
            position ? "rounded-[8px]" : "rounded-2xl"
          }`}
        >
          {/* Modal Header */}
          {title && (
            <div
              className={`
                ${position === "modal-right" ? "border-b border-[#ECEEEE]" : ""}
                flex justify-between items-start pt-[24px] px-[24px] mb-[12px]
                `}
            >
              <p className="text-lg text-headers font-medium capitalize-first">
                {title}
              </p>

              <button type="button" data-testid="close-modal" onClick={close}>
                <Icon icon="ph:x" className="w-[19.8px] h-[19.8px]" />
              </button>
            </div>
          )}

          {/* Modal Content (Scrollable) */}
          <div
            className={`px-[24px] overflow-y-auto flex-grow py-6 ${
              position === "modal-center" ? "max-h-[70vh]" : "mb-20"
            }`}
          >
            {children}
          </div>

          {/* Footer (Fixed to Bottom) */}
          {footerContent && (
            <div className="modal-right-button-container p-4 mb-4">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};