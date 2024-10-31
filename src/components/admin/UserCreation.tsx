"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bread, Toast } from "../ui/Toast";

export default function UserCreation() {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

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
      bread("Successfully created user!");
      setFirstName("");
      setLastName("");
      setEmail("");
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
      <Toast />
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
      </div>
    </>
  );
}
