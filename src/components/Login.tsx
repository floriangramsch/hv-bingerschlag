"use client";

import Select, { SingleValue } from "react-select";
import { useState, useEffect } from "react";
import { TSelectUser, TUser } from "@/app/helpers/types";

export default function Login({
  setName,
}: {
  setName: (name: TSelectUser | undefined) => void;
}) {
  const [user, setUser] = useState<TSelectUser>();
  const [userOptions, setUserOptions] = useState<TSelectUser[]>();

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = () => {
    fetch("/api/members/getMembers")
      .then((response) => response.json())
      .then((users: TUser[]) => {
        const names: TSelectUser[] = [];
        users.forEach((user) => {
          const value = user["id"];
          const label = user["first_name"] + " " + user["last_name"];
          names.push({
            value: value,
            label: label,
            first_name: user["first_name"],
          });
        });
        setUserOptions(names);
      });
  };

  const changeUser = (e: SingleValue<TSelectUser | null>) => {
    if (e) {
      setUser(e);
    }
  };

  const loginUser = () => {
    setName(user);
  };

  return (
    <>
      <div className="flex text-center justify-center p-4 mt-1 mb-4 rounded text-xl font-bold bg-primary">
        Click your name to proceed
      </div>
      <div className="mt-16 flex flex-col  bg-bg text-text border-2 border-primary p-5">
        <div className="grid grid-cols-3 gap-3">
          {userOptions &&
            userOptions.map((user) => {
              return (
                <div
                  className="w-20 h-20 bg-secondory border border-bg-lighter flex justify-center items-center"
                  key={user.value}
                  // onClick={() => changeUser(user)}
                  onClick={() => setName(user)}
                >
                  {user.first_name}
                </div>
              );
            })}
        </div>
        {/* <button
          className="inline-block py-2 px-4 m-4 text-lg text-bold text-white bg-button border-none rounded cursor-pointer"
          onClick={loginUser}
        >
          Join
        </button> */}
      </div>
    </>
  );
}
