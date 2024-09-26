"use client";

import React, { useEffect, useState } from "react";
import { convertDate } from "../helpers/functions";
import { TAssignedShifts } from "../helpers/types";
import { useQuery } from "@tanstack/react-query";

export default function ShiftPlan() {
  const [month, setMonth] = useState(() => getMonth());
  const [year, setYear] = useState(() => getYear());
  const [special, setSpecial] = useState<boolean>(false);

  function getMonth() {
    const currentDate = new Date();
    let month = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return month.getMonth() + 1;
  }

  function getYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  const {
    data: shifts,
    isLoading,
    error,
  } = useQuery<TAssignedShifts[]>({
    queryKey: ["assignedShifts", year, month, special],
    queryFn: async () => {
      const response = await fetch("/api/shifts/getShifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month, special }),
      });
      return await response.json();
    },
  });

  const changeMonth = (advance: boolean) => {
    if (advance) {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    }
  };

  const convertMonthName = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1] + " " + year;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shifts</div>;

  return (
    <>
      <div className="text-3xl mb-3 flex flex-col">
        <div className="flex justify-center text-4xl">{convertMonthName()}</div>
        <div>{special && "Special Events"}</div>
      </div>
      <div className="flex space-x-5">
        <i
          aria-hidden
          className="fa-solid fa-left-long text-5xl"
          style={{ color: "#e74c3c" }}
          onClick={() => changeMonth(false)}
        />
        {special ? (
          <i
            aria-hidden
            className="fa-solid fa-star text-5xl"
            style={{ color: "#e74c3c" }}
            onClick={() => setSpecial(false)}
          />
        ) : (
          <i
            aria-hidden
            className="fa-regular fa-star text-5xl"
            style={{ color: "#e74c3c" }}
            onClick={() => setSpecial(true)}
            // onClick={() => setView("special")}
          />
        )}
        <i
          aria-hidden
          className="fa-solid fa-right-long text-5xl"
          style={{ color: "#e74c3c" }}
          onClick={() => changeMonth(true)}
        />

        {/* <input
          className="w-10 h-10"
          type="checkbox"
          onChange={() => setCurrent(!current)}
        />
        <input
          className="w-10 h-10"
          type="checkbox"
          onChange={() => setSpecial(!special)}
        /> */}
      </div>
      <div className="grid grid-cols-2 mt-6 gap-2">
        {shifts?.map(
          ({
            id,
            date,
            end_date,
            worker1_name,
            worker2_name,
            special_event,
            special_name,
          }) => (
            <div
              className="my-4 border border-secondory rounded p-2 text-text shadow"
              key={id}
              style={{
                margin: "0",
              }}
            >
              <div className="font-bold text-xl">
                {convertDate(new Date(date))}
              </div>
              <div>{special_name}</div>
              <div className="text-text text-lg mb-1 mr-4">
                <div>{worker1_name}</div>
                <div>{worker2_name}</div>
                {!worker1_name && !worker2_name && <div>Not manned!</div>}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
