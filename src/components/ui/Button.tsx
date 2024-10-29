import { ReactNode } from "react";

export default function Button({
  func,
  type,
  children,
  className,
}: {
  func?: () => void;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`inline-block p-1 ml-2 text-base font-bold bg-button border-none rounded cursor-pointer ${className}`}
      type={type ?? "button"}
      onClick={func}
    >
      {children}
    </button>
  );
}
