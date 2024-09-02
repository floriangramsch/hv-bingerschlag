"use client";

import React, { useEffect, useState } from "react";
import { convertDate } from "../helpers/functions";
import { TAssignedShifts } from "../helpers/types";

export default function ShiftPlan() {
  const [shifts, setShifts] = useState<TAssignedShifts[]>([]);
  const [current, setCurrent] = useState<boolean>(true);
  const [month, setMonth] = useState(() => getMonth());
  const [special, setSpecial] = useState<boolean>(false);

  function getMonth() {
    const currentDate = new Date();
    let month = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return month.getMonth() + 1;
  }

  useEffect(() => {
    getView();
  }, [month, special, current]);

  const getView = () => {
    fetch("/api/shifts/getShifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ month: current ? month : month + 1, special }),
    })
      .then((response) => response.json())
      .then((data: TAssignedShifts[]) => {
        setShifts(data);
      })
      .catch((error) => {
        console.error("Error fetching shifts:", error);
      });
  };

  return (
    <>
      <div className="text-3xl mb-3 flex flex-col">
        <div>{current ? "Current Month" : "Next Month"}</div>
        <div>{special ? "Special Events" : "Normal Events"}</div>
      </div>
      <input type="checkbox" onChange={() => setCurrent(!current)} />
      <input type="checkbox" onChange={() => setSpecial(!special)} />
      <div className="grid grid-cols-2 mt-3">
        {shifts
          ? shifts.map(
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
                    // marginRight: data.type === 1 ? "10px" : "0",
                  }}
                >
                  <div className="font-bold text-lg">
                    {" "}
                    {convertDate(new Date(date))}
                  </div>
                  <div className="text-text text-lg mb-1 mr-4">
                    {worker1_name}
                  </div>
                  <div className="text-text text-lg mb-1 mr-4">
                    {worker2_name}
                  </div>
                </div>
              )
            )
          : "No Data"}
      </div>
    </>
  );
}
