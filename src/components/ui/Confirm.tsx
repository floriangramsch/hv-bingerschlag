import { useRef } from "react";
import Button from "./Button";

type ConfirmProps = {
  isOpen: boolean;
  yes: () => void;
  no: () => void;
  children?: React.ReactNode;
};

export default function Confirm(data: ConfirmProps) {
  const dialog = useRef<HTMLDivElement | null>(null);

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (dialog.current && !dialog.current.contains(e.target as Node)) {
      data.no();
    }
  };

  return (
    data.isOpen && (
      <div
        onClick={handleOverlayClick}
        className="fixed bg-black h-screen w-screen bg-opacity-50 z-50 flex items-center justify-center"
      >
        <div
          ref={dialog}
          className="fixed flex flex-col rounded shadow items-center justify-center w-64 h-32 bg-secondory border-2 border-primary gap-y-2"
        >
          <div className="text-3xl font-bold">{data.children}</div>
          <div className="space-x-2">
            <Button func={data.yes} className="bg-primary">
              Yes
            </Button>
            <Button func={data.no} className="bg-primary">
              No
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
