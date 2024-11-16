"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const path = usePathname();
  const [activeClass, setActiveClass] = useState<string | null>(null);

  const test = (pathName: string) => {
    switch (pathName) {
      case "/shiftPlan":
        return path === "/shiftPlan" || path.split("/")[1] === "edit-shift";
      case "/":
        return path === "/" || path.split("/")[1] === "edit-member";
      case "/barCalendar":
        return path === "/barCalendar" || path === "/barCalendar/barUsage";
      case "/admin":
        return (
          path === "/admin" ||
          path === "/surveyOverview" ||
          path === "/shiftAssignment"
        );
      default:
        return false;
    }
  };

  useEffect(() => {
    const timeout = 1800;
    if (test("/shiftPlan")) {
      setActiveClass("shiftPlan");
      setTimeout(() => setActiveClass(null), timeout);
    } else if (test("/")) {
      setActiveClass("home");
      setTimeout(() => setActiveClass(null), timeout);
    } else if (test("/barCalendar")) {
      setActiveClass("barCalendar");
      setTimeout(() => setActiveClass(null), timeout);
    } else if (test("/admin")) {
      setActiveClass("admin");
      setTimeout(() => setActiveClass(null), timeout);
    }
  }, [path]);

  const activeColor = "#e74c3c";
  const inactiveColor = "#cb6354";

  return (
    <footer className="flex sticky safe-area-inset bottom-0 left-0 shadow w-full text-3xl bg-bg border-t border-bg-lighter pt-2 pb-7 justify-around z-10">
      <a href="/shiftPlan">
        <i
          aria-hidden
          className={`fa-solid fa-beer-mug-empty ${
            activeClass === "shiftPlan" ? "fa-bounce" : ""
          }`}
          style={{ color: test("/shiftPlan") ? activeColor : inactiveColor }}
        />
      </a>
      <a href="/">
        <i
          aria-hidden
          className={`fa-solid fa-house ${
            activeClass === "home" ? "fa-bounce" : ""
          }`}
          style={{ color: test("/") ? activeColor : inactiveColor }}
        />
      </a>
      <a href="/barCalendar">
        <i
          aria-hidden
          className={`fa-regular fa-calendar ${
            activeClass === "barCalendar" ? "fa-bounce" : ""
          }`}
          style={{ color: test("/barCalendar") ? activeColor : inactiveColor }}
        />
      </a>
      <a href="/admin">
        <i
          aria-hidden
          className={`fa-solid fa-lock ${
            activeClass === "admin" ? "fa-bounce" : ""
          }`}
          style={{ color: test("/admin") ? activeColor : inactiveColor }}
        />
      </a>
    </footer>
  );
}
