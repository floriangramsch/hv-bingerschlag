"use client";

import { TSelectUser, TUser } from "@/app/helpers/types";
import useIsAdmin from "@/app/helpers/useIsAdmin";
import { useQuery } from "@tanstack/react-query";
import { MouseEvent, MouseEventHandler, useState } from "react";

export default function Login({
  setName,
}: {
  setName: (name: TSelectUser | undefined) => void;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userIdToRemove, setUserIdToRemove] = useState<number | undefined>(
    undefined
  );

  const {
    data: userOptions,
    isLoading,
    error,
  } = useQuery<TSelectUser[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await fetch("/api/members/getMembers");
      const users: TUser[] = await response.json();
      return users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        registered: user.registered,
      }));
    },
  });

  const { data: isAdmin } = useIsAdmin();

  const openDialog = (e: MouseEvent<HTMLButtonElement>, userId: number) => {
    e.stopPropagation();
    setShowDialog(true);
    setUserIdToRemove(userId);
  };

  const close = () => {
    setShowDialog(false);
  };

  const removeUser = () => {
    console.log(userIdToRemove);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="flex flex-col">
      <div className="flex text-center justify-center p-4 mt-1 mb-4 rounded text-xl font-bold bg-primary">
        Click your name to proceed
      </div>
      <div className="mt-16 flex flex-col  bg-bg text-text border-2 border-primary p-5">
        <div className="grid grid-cols-3 gap-3">
          {userOptions &&
            userOptions.map((user) => {
              return (
                <div
                  className={`relative w-20 h-20 ${
                    isAdmin &&
                    (user.registered ? "border-green-500" : "border-red-500")
                  } border border-bg-lighter flex justify-center items-center`}
                  key={user.value}
                  onClick={() => setName(user)}
                >
                  {user.first_name}
                  <button
                    onClick={(e) => openDialog(e, user.value)}
                    hidden={!isAdmin}
                    className={`absolute right-0 bottom-0 pr-2`}
                  >
                    x
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      {showDialog && (
        <div className="absolute flex flex-col rounded shadow items-center justify-center w-48 h-20 top-1/2 left-1/2 bg-black">
          Sure?
          <div className="space-x-2">
            <button onClick={removeUser} className="bg-primary p-1 rounded">
              Yes
            </button>
            <button onClick={close} className="bg-primary p-1 rounded">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
