import { ReactNode } from "react";

export default function Button({
  func,
  type,
  children,
  className,
  disabled,
}: {
  func?: () => void;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`inline-block p-1 ml-2 text-base font-bold bg-button border-none rounded cursor-pointer ${className} ${
        disabled ? "opacity-50" : ""
      }`}
      type={type ?? "button"}
      onClick={func}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
