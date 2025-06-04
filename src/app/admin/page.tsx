"use client";

import Mailer from "@/components/admin/Mailer";
import ShiftCreation from "@/components/admin/ShiftCreation";
import UserCreation from "@/components/admin/UserCreation";
import { KeyboardEvent, useState } from "react";
import useIsAdmin, { useLogin, useLogout } from "../../composables/useAdmin";
import Button from "@/components/ui/Button";
import Loading from "@/components/Loading";
import { bread } from "@/components/ui/Toast";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [locked, setLocked] = useState(false);

  const { data: isAdmin, isLoading, error } = useIsAdmin();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const loginAdmin = () => {
    setLocked(true);
    if (password) {
      loginMutation.mutate(password, {
        onSettled: () => setLocked(false),
        onError: (error: Error) => {
          bread(error.message);
          setPassword("");
        },
      });
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginAdmin();
    }
  };

  const switchShowPasswort = () => {
    setShowPassword((oldShowPassword) => !oldShowPassword);
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
            <div className="relative flex justify-center items-center">
              <input
                className="p-1 text-xl text-text bg-bg border border-primary rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                onKeyDown={handleKeyPress}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div
                onClick={switchShowPasswort}
                className={`absolute right-3 cursor-pointer ${
                  showPassword ? "fa-eye" : "fa-cat"
                }`}
              >
                <i
                  aria-hidden
                  className={`fa-solid text-text ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                />
              </div>
            </div>
            <Button
              className="px-5 py-3 mt-4"
              func={loginAdmin}
              disabled={loginMutation.isPending || locked}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
