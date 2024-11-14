"use client";

import Mailer from "@/components/admin/Mailer";
import ShiftCreation from "@/components/admin/ShiftCreation";
import UserCreation from "@/components/admin/UserCreation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyboardEvent } from "react";
import useIsAdmin, { useLogin, useLogout } from "../helpers/useIsAdmin";
import { bread, Toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/Loading";

export default function Admin() {
  const { data: isAdmin, isLoading, error } = useIsAdmin();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const loginAdmin = () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    loginMutation.mutate(password, {
      onError: () =>
        ((document.getElementById("password") as HTMLInputElement).value = ""),
    });
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginAdmin();
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading admin status</div>;

  return (
    <>
      {isAdmin ? (
        <>
          <div className="flex flex-col justify-center items-center gap-1 text-2xl">
            <div className="flex text-center justify-center p-4 mb-5 mt-1 w-1/2 border-none text-xl font-bold bg-primary rounded">
              Welcome to the Admin Area
            </div>
            <div className="m-4 space-x-2 [&>a]:bg-secondory [&>a]:rounded [&>a]:p-2">
              <a href="/surveyOverview">Overview</a>
              <a href="/shiftAssignment">Shift Assignment</a>
            </div>

            {/* Logout */}
            <Button func={logoutMutation.mutate}>Logout</Button>
          </div>

          <UserCreation />
          <ShiftCreation />
          <Mailer />
        </>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <div className="flex text-center justify-center p-4 mb-5 mt-1 w-1/2 border-none text-xl font-bold bg-primary rounded">
            Admin Area
          </div>
          <div className="mt-28 flex flex-col items-center bg-bg text-text border-2 border-primary rounded p-5">
            <input
              className="h-8 bg-bg border border-primary rounded text-text text-center"
              type="password"
              name="password"
              id="password"
              onKeyDown={handleKeyPress}
            />
            <Button className="px-5 py-3 mt-4" func={loginAdmin}>
              Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
