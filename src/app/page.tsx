"use client";

import Login from "@/components/Login";
import { useState } from "react";
import { TSelectUser } from "./helpers/types";
import ShiftSelection from "@/components/ShiftSelection";

export default function Home() {
  const [user, setUser] = useState<TSelectUser | undefined>();

  const setName = (name: TSelectUser | undefined) => {
    setUser(name);
  };

  return (
    <div>
      {user ? <ShiftSelection user={user} /> : <Login setName={setName} />}
    </div>
  );
}
