export default function Footer() {
  return (
    <footer className="flex sticky safe-area-inset bottom-0 left-0 shadow w-full text-4xl bg-bg border-t border-bg-lighter p-4 pb-10 justify-around z-10 pb-safe">
      <a href="/shiftPlan">
        <i
          aria-hidden
          className="fa-solid fa-beer-mug-empty"
          style={{ color: "#e74c3c" }}
        />
      </a>
      <a href="/">
        <i
          aria-hidden
          className="fa-solid fa-house"
          style={{ color: "#e74c3c" }}
        />
      </a>
      <a href="/barCalendar">
        <i
          aria-hidden
          className="fa-regular fa-calendar"
          style={{ color: "#e74c3c" }}
        />
      </a>
      <a href="/admin">
        <i
          aria-hidden
          className="fa-solid fa-lock"
          style={{ color: "#e74c3c" }}
        />
      </a>
    </footer>
  );
}
