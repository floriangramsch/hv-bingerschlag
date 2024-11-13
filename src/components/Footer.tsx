export default function Footer() {
  return (
    <div className="flex fixed bottom-0 left-0 shadow w-full text-5xl bg-bg border-t border-bg-lighter p-4 justify-evenly z-10">
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
    </div>
  );
}
