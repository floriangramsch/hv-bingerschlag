"use client";

export default function Loading() {
  return (
    <div className="absolute flex justify-center items-center size-full text-5xl -mt-10 text-text gap-2">
      <i
        aria-hidden
        className={"fa-solid fa-beer-mug-empty fa-spin-pulse"}
        style={{ color: "#e74c3c" }}
      />
      <div className="loading-text">Loading...</div>
    </div>
  );
}
