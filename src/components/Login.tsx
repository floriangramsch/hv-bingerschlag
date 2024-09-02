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
        Who are you?
      </div>
      <div className="mt-32 flex flex-col justify-center bg-bg text-text border-2 border-primary p-5">
        {/* <Select
          instanceId="nameasd"
          className="basic-single select-control text-black"
          classNamePrefix="select"
          defaultValue={null}
          isSearchable={true}
          name="color"
          options={userOptions}
          onChange={(e) => changeUser(e)}
        /> */}
        {userOptions &&
          userOptions.map((user) => {
            return (
              <div key={user.value} onClick={() => changeUser(user)}>
                {user.first_name}
              </div>
            );
          })}
        <button
          className="inline-block py-2 px-4 m-4 text-lg text-bold text-white bg-button border-none rounded cursor-pointer"
          onClick={loginUser}
        >
          Join
        </button>
      </div>
    </>
  );
}
