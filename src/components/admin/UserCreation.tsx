"use client";

import { useState } from "react";

export default function UserCreation() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");

  const addUser = () => {
    fetch("/api/admin/addUser", {
      method: "Post",
      body: JSON.stringify({ firstName, lastName, email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setNotification("User added successfully!");
        setTimeout(() => setNotification(""), 3000);
      });
  };
  return (
    <>
      <div className="my-4 border border-secondory rounded p-2 text-text shadow">
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="firstName"
          placeholder="First Name"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="lastName"
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
        />
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          id="email"
          placeholder="E-Mail"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
          onClick={addUser}
        >
          Add User
        </button>
        {notification && <div className="label">{notification}</div>}
      </div>
    </>
  );
}
