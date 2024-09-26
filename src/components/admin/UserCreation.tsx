"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserCreation() {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

  const addUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/addUser", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email }),
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setNotification("User added successfully!");
      setTimeout(() => setNotification(""), 3000);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const addUser = () => {
    addUserMutation.mutate();
  };

  return (
    <>
      <div className="my-4 border border-secondory rounded p-2 text-text shadow">
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="email"
          placeholder="E-Mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
          onClick={addUser}
          disabled={addUserMutation.isPending}
        >
          {addUserMutation.isPending ? "Adding..." : "Add User"}
        </button>
        {notification && <div className="label">{notification}</div>}
      </div>
    </>
  );
}
