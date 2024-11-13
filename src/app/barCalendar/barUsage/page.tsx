"use client";

import { bread, Toast } from "@/components/ui/Toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const BarUsage = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [title, setTitle] = useState<string>("");

  const takeBarMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/events/useBar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, endDate, title }),
      });
      if (!response.ok) {
        throw new Error("Failed to use bar");
      }
      return response.json();
    },
    onSuccess: () => {
      bread("You may use the bar now!");
      window.location.href = "/barCalendar";
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  return (
    <>
      <Toast />
      <div className="mt-28 flex flex-col justify-center border-2 border-primary p-5 rounded shadow">
        <span>Title</span>
        <input
          className="text-black"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <span>Start Time</span>
      <input
        type="datetime-local"
        className="bg-bg border-2 border-primary rounded p-2 text-white"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <br />
      <span>End Time</span>
      <input
        type="datetime-local"
        className="bg-bg border-2 border-primary rounded p-2 text-white mb-3"
        id="endDate"
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
      />
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => takeBarMutation.mutate()}
        disabled={takeBarMutation.isPending}
      >
        Use Bar
      </button>
    </>
  );
};

export default BarUsage;
