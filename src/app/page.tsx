"use client";

import Login from "@/components/Login";
import { useState } from "react";
import { TSelectUser } from "./helpers/types";
import ShiftSelection from "@/components/ShiftSelection";

export default function Home() {
  const [user, setUser] = useState<TSelectUser | undefined>()
  // const [user, setUser] = useState<TSelectUser | undefined>({
  //   value: 69,
  //   label: "Fucker",
  //   first_name: "Fuck",
  //   registered: false,
  //   is_active: true,
  // });

  const setName = (name: TSelectUser | undefined) => {
    setUser(name);
  };

  return (
    <div className="size-screen">
      {user ? <ShiftSelection user={user} /> : <Login setName={setName} />}
    </div>
  );
}
