"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bread } from "../ui/Toast";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function UserCreation() {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
      bread(error.message);
    },
  });

  const addUser = () => {
    addUserMutation.mutate();
  };

  return (
    <>
      <div className="my-4 space-y-2 border border-secondory rounded p-2 text-text shadow">
        <Input
          value={firstName}
          placeholder="First Name"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Input
          value={lastName}
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
        />
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
          id="email"
          placeholder="E-Mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          className="px-5 py-3"
          func={addUser}
          disabled={addUserMutation.isPending}
        >
          {addUserMutation.isPending ? "Adding..." : "Add User"}
        </Button>
      </div>
    </>
  );
}
