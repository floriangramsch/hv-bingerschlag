"use client";

import Mailer from "@/components/admin/Mailer";
import ShiftCreation from "@/components/admin/ShiftCreation";
import UserCreation from "@/components/admin/UserCreation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyboardEvent } from "react";

export default function Admin() {
  const queryClient = useQueryClient();

  const {
    data: isAdmin,
    isLoading,
    error,
  } = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        const storedIsAdmin = localStorage.getItem("isAdmin");
        return storedIsAdmin === "true";
      }
      return false;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(password),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const success = await response.json();
      if (success) {
        localStorage.setItem("isAdmin", "true");
        return true;
      } else {
        throw new Error("Falsches Password!");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
    onError: (error: Error) => {
      alert(error.message);
      const pwInput = document.getElementById("password") as HTMLInputElement;
      pwInput.value = "";
    },
  });

  const loginAdmin = () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    loginMutation.mutate(password);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const password = (document.getElementById("password") as HTMLInputElement)
        ?.value;
      loginMutation.mutate(password);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.setItem("isAdmin", "false");
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading admin status</div>;

  return (
    <>
      {isAdmin ? (
        <>
          <a href="/surveyOverview">Overview</a>
          <a href="/shiftAssignment">Shift Assignment</a>

          {/* Logout */}
          <button
            className="inline-block p-1 ml-2 text-base font-bold bg-button border-none rounded cursor-pointer"
            onClick={() => logoutMutation.mutate()}
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
