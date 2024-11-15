"use client";

import React, { useState } from "react";
import { convertDate } from "../helpers/functions";
import { TAssignedShifts } from "../helpers/types";
import { useQuery } from "@tanstack/react-query";
import useIsAdmin from "../../composables/useAdmin";
import { Toast } from "@/components/ui/Toast";
import Loading from "@/components/Loading";
import { useGetAssignedShifts } from "@/composables/useShifts";

export default function ShiftPlan() {
  const [month, setMonth] = useState(() => getMonth());
  const [year, setYear] = useState(() => getYear());
  const [special, setSpecial] = useState<boolean>(false);

  const { data: isAdmin } = useIsAdmin();

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
  } = useGetAssignedShifts({ year, month, special });

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

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading shifts</div>;

  return (
    <div className="p-2">
      <div className="text-3xl mb-3 flex flex-col">
        <div className="flex justify-center text-4xl">{convertMonthName()}</div>
        {special && (
          <div className="flex justify-center">{"Special Events"}</div>
        )}
      </div>
      <div className="flex justify-center space-x-5">
        <i
          aria-hidden
          className="fa-solid fa-left-long text-5xl cursor-pointer"
          style={{ color: "#e74c3c" }}
          onClick={() => changeMonth(false)}
        />
        {special ? (
          <i
            aria-hidden
            className="fa-solid fa-star text-5xl cursor-pointer"
            style={{ color: "#e74c3c" }}
            onClick={() => setSpecial(false)}
          />
        ) : (
          <i
            aria-hidden
            className="fa-regular fa-star text-5xl cursor-pointer"
            style={{ color: "#e74c3c" }}
            onClick={() => setSpecial(true)}
            // onClick={() => setView("special")}
          />
        )}
        <i
          aria-hidden
          className="fa-solid fa-right-long text-5xl cursor-pointer"
          style={{ color: "#e74c3c" }}
          onClick={() => changeMonth(true)}
        />
      </div>
      <div className="grid grid-cols-2 justify-center mt-6 gap-2">
        {shifts &&
          shifts?.map(
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
                className="relative my-4 border border-secondory rounded p-2 text-text shadow"
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
                {isAdmin && (
                  <div className="absolute bottom-1 right-1">
                    <i
                      aria-hidden
                      className="fa-solid fa-edit text-2xl cursor-pointer"
                      style={{ color: "#e74c3c" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/edit-shift/${id}`;
                      }}
                    />
                  </div>
                )}
              </div>
            )
          )}
      </div>
      <Toast />
    </div>
  );
}
