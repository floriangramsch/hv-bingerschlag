"use client";

import { TSelectUser } from "@/app/helpers/types";
import useIsAdmin from "@/composables/useAdmin";
import { MouseEvent, useState } from "react";
import { bread, Toast } from "./ui/Toast";
import Confirm from "./ui/Confirm";
import Loading from "./Loading";
import { useGetUsers, useRetireUser } from "@/composables/useUsers";

export default function Login({
  setName,
}: {
  setName: (name: TSelectUser | undefined) => void;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userIdToRemove, setUserIdToRemove] = useState<number | undefined>(
    undefined
  );

  const { data: users, isLoading, error } = useGetUsers();

  const { data: isAdmin } = useIsAdmin();

  const openDialog = (e: MouseEvent<HTMLElement>, userId: number) => {
    e.stopPropagation();
    setShowDialog(true);
    setUserIdToRemove(userId);
  };

  const close = () => {
    setShowDialog(false);
  };

  const removeUser = () => {
    if (userIdToRemove) {
      retireUserMutation.mutate(
        { id: userIdToRemove, retire: true },
        {
          onSuccess: () => {
            bread("User retired successfully!");
            setShowDialog(false);
          },
        }
      );
    }
  };

  const retireUserMutation = useRetireUser();

  const setUser = (user: TSelectUser) => {
    if (user.is_active) {
      // login
      setName(user);
    } else if (isAdmin) {
      // set active
      retireUserMutation.mutate(
        { id: user.value, retire: false },
        {
          onSuccess: () => {
            bread("Set user successfully active!");
            setShowDialog(false);
          },
        }
      );
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="flex flex-col size-full gap-10">
      <div className="w-full flex justify-center mt-4">
        <div className="text-center p-4 rounded text-xl font-bold bg-primary">
          Click your name to proceed
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col w-5/6 bg-bg text-text border-2 border-primary p-5">
          <div className="grid grid-cols-3 gap-3 place-items-center">
            {users &&
              users.map((user) => {
                return (
                  <div
                    className={`relative w-20 h-20 cursor-pointer ${
                      user.is_active
                        ? isAdmin &&
                          (user.registered
                            ? "border-green-500"
                            : "border-red-500")
                        : isAdmin
                        ? "border-gray-500"
                        : "hidden"
                    } border border-bg-lighter flex justify-center items-center`}
                    key={user.value}
                    onClick={() => setUser(user)}
                  >
                    {user.first_name}
                    {isAdmin && (
                      <>
                        <div className="absolute right-1 top-0">
                          <i
                            aria-hidden
                            className="fa-solid fa-close text-2xl cursor-pointer"
                            style={{ color: "#e74c3c" }}
                            onClick={(e) => openDialog(e, user.value)}
                          />
                        </div>
                        <div className="absolute left-1 bottom-0">
                          <i
                            aria-hidden
                            className="fa-solid fa-edit text-lg cursor-pointer"
                            style={{ color: "#e74c3c" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/edit-member/${user.value}`;
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Confirm isOpen={showDialog} yes={removeUser} no={close}>
        Retire?
      </Confirm>
      <Toast />
    </div>
  );
}
