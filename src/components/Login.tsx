"use client";

import { TSelectUser, TUser } from "@/app/helpers/types";
import useIsAdmin from "@/app/helpers/useIsAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MouseEvent, useState } from "react";
import { bread, Toast } from "./ui/Toast";

export default function Login({
  setName,
}: {
  setName: (name: TSelectUser | undefined) => void;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userIdToRemove, setUserIdToRemove] = useState<number | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const {
    data: users,
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
        is_active: user.is_active,
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
    if (userIdToRemove) {
      retireUserMutation.mutate(
        { id: userIdToRemove, retire: true },
        { onSuccess: () => bread("User retired successfully!") }
      );
    }
  };

  const retireUserMutation = useMutation({
    mutationFn: async ({ id, retire }: { id: number; retire: boolean }) => {
      const response = await fetch("/api/members/retireUser", {
        method: "PUT",
        body: JSON.stringify({ id, retire }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      return response.json();
    },
    onSuccess: () => {
      setShowDialog(false);
      queryClient.refetchQueries({ queryKey: ["members"] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const setUser = (user: TSelectUser) => {
    if (user.is_active) {
      // login
      setName(user);
    } else if (isAdmin) {
      // set active
      retireUserMutation.mutate(
        { id: user.value, retire: false },
        { onSuccess: () => bread("Set user successfully active!") }
      );
    }
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
                    <div className="absolute right-0 bottom-0 pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/edit-member/${user.value}`;
                        }}
                      >
                        e
                      </button>
                      <button onClick={(e) => openDialog(e, user.value)}>
                        x
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {showDialog && (
        <div className="absolute flex flex-col rounded shadow items-center justify-center w-48 h-20 top-1/2 left-1/2 bg-black">
          Retire?
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
      <Toast />
    </div>
  );
}
