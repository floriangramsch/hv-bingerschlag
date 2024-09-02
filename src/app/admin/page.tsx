"use client";

import Mailer from "@/components/admin/Mailer";
import ShiftCreation from "@/components/admin/ShiftCreation";
import UserCreation from "@/components/admin/UserCreation";
import { useState, useEffect, KeyboardEvent } from "react";

export default function Admin() {
  const debug = true;
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsAdmin = localStorage.getItem("isAdmin");
      setIsAdmin(storedIsAdmin === "true" || debug);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAdmin", String(isAdmin));
    }
  }, [isAdmin]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      loginAdmin();
    }
  };

  const loginAdmin = () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(password),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((success) => {
        if (success) {
          setIsAdmin(true);
        } else {
          alert("Falsches Password!");
          const pwInput = document.getElementById(
            "password"
          ) as HTMLInputElement;
          pwInput.value = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {isAdmin ? (
        <>
          <a href="/surveyOverview">Overview</a>
          <a href="/shiftAssignment">Shift Assignment</a>

          {/* Logout */}
          <button
            className="inline-block p-1 ml-2 text-base font-bold bg-button border-none rounded cursor-pointer"
            onClick={() => setIsAdmin(false)}
          >
            Logout
          </button>

          <UserCreation />
          <ShiftCreation />
          <Mailer />
        </>
      ) : (
        <>
          <div className="flex text-center justify-center p-4 mb-5 mt-1 w-1/2 border-none text-xl font-bold bg-primary rounded">
            Welcome to the Admin Area
          </div>
          <div className="mt-28 flex flex-col items-center bg-bg text-text border-2 border-primary rounded p-5">
            <input
              className="h-6 rounded text-black"
              type="password"
              name="password"
              id="password"
              onKeyDown={handleKeyPress}
            />
            <button
              className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
              type="button"
              onClick={loginAdmin}
            >
              Login
            </button>
          </div>
        </>
      )}
    </>
  );
}
