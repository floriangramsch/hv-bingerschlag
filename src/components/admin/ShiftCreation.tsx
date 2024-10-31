"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bread, Toast } from "../ui/Toast";

const ShiftCreation = () => {
  const queryClient = useQueryClient();
  const [date, setDay] = useState(getTodayDate());
  const [endDate, setEndDay] = useState(getTodayDate());
  const [month, setMonth] = useState<number>(getNextMonth());
  const [specialEvent, setSpecialEvent] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("barTest");

  function getNextMonth() {
    const currentDate = new Date();
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return nextMonth.getMonth() + 1; // Monat beginnt bei 0 zu zählen, daher +1
  }

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Monate beginnen bei 0
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const createShiftMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/createShift", {
        method: "POST",
        body: JSON.stringify({ date, endDate, specialEvent, eventName }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create shift");
      }
      return response.json();
    },
    onSuccess: (msg: string) => {
      bread(msg);
      setMonth(getNextMonth());
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const createMonthMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/createMonth", {
        method: "POST",
        body: JSON.stringify(month),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create month");
      }
      return response.json();
    },
    onSuccess: () => {
      bread("Successfully created month!");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const createShift = () => {
    createShiftMutation.mutate();
  };

  const createMonth = () => {
    createMonthMutation.mutate();
  };

  return (
    <div className="my-4 border border-secondory rounded p-2 text-text shadow">
      <Toast />
      <span>Special Event</span>
      <input type="checkbox" onChange={() => setSpecialEvent(!specialEvent)} />
      <input
        className="text-black"
        hidden={!specialEvent}
        value={eventName}
        onChange={(event) => setEventName(event.target.value)}
      />
      <br />
      <span>Start Time</span>
      <input
        type="datetime-local"
        className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
        value={date}
        onChange={(event) => setDay(event.target.value)}
      />
      <br />
      <span>End Time</span>
      <input
        type="datetime-local"
        className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
        value={endDate}
        onChange={(event) => setEndDay(event.target.value)}
      />
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={createShift}
        disabled={createShiftMutation.isPending}
      >
        {createShiftMutation.isPending ? "Creating..." : "Create Shift"}
      </button>
      <div className="mx-3 flex flex-col">
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          placeholder={String(month)}
          id="month"
          onChange={(event) => setMonth(Number(event.target.value))}
        />
        <button
          className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
          onClick={createMonth}
          disabled={createMonthMutation.isPending}
        >
          {createMonthMutation.isPending ? "Creating..." : "Create Shift Month"}
        </button>
      </div>
    </div>
  );
};

export default ShiftCreation;
