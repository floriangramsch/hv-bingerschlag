"use client";

import React, { useEffect, useState } from "react";
import { convertDate } from "../helpers/functions";
import Loading from "@/components/Loading";
import { useAssignShiftsMutation } from "@/composables/useShifts";
import { useGetSurveysToAssign } from "@/composables/useSurveys";

export default function ShiftAssignment() {
  const { data: shifts, isLoading, error } = useGetSurveysToAssign();

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  // Initialisiere checkedMap, wenn shifts geladen werden
  useEffect(() => {
    if (shifts) {
      const initial: Record<string, boolean> = {};
      Object.values(shifts).forEach((shift: any) => {
        Object.entries(shift.surveys || {}).forEach(([surveyId, user]: any) => {
          initial[surveyId] = user.assigned;
        });
      });
      setCheckedMap(initial);
    }
  }, [shifts]);

  const mutation = useAssignShiftsMutation();

  const assignShifts = () => {
    mutation.mutate(checkedMap);
  };

  const handleUserItemClick = (surveyId: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [surveyId]: !prev[surveyId],
    }));
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading surveys</div>;

  return (
    <div className="p-2">
      <div className="flex flex-col justify-center items-center border border-primary p-5 mb-2">
        <div>Green border: Good to go.</div>
        <div>Red border: Only if really necessary</div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {shifts
          ? Object.entries(shifts).map(([surveyShiftId, data]) => {
              return (
                <div
                  className="my-4 border border-secondory rounded p-3 text-text shadow"
                  key={surveyShiftId}
                  style={{
                    margin: "0",
                  }}
                >
                  <div className="flex flex-col">
                    <h3>
                      {convertDate(new Date(data.date))
                        .split(",")
                        .map((entry, idx) => (
                          <React.Fragment key={idx}>
                            {entry}
                            <br />
                          </React.Fragment>
                        ))}
                    </h3>
                    <h4>{data.specialEvent ? data.specialName : <br />}</h4>
                  </div>
                  {data.surveys && Object.keys(data.surveys).length > 0
                    ? Object.entries(data.surveys).map(([surveyId, user]) => {
                        return (
                          <div
                            key={surveyId}
                            className="flex relative justify-center items-center p-1 mb-1 min-h-10 min-w-full border border-primary rounded cursor-pointer overflow-hidden"
                            onClick={(e) => {
                              // Nur toggeln, wenn nicht direkt auf die Checkbox geklickt wurde
                              if (
                                (e.target as HTMLElement).tagName !== "INPUT"
                              ) {
                                handleUserItemClick(surveyId);
                              }
                            }}
                            style={{
                              borderColor:
                                user.availability === 1 ? "green" : "red",
                            }}
                          >
                            {user.user} {user.assigned}
                            <div className="flex items-center">
                              <input
                                id={surveyId}
                                type="checkbox"
                                className="peer hidden"
                                checked={!!checkedMap[surveyId]}
                                onChange={() => handleUserItemClick(surveyId)}
                              />
                              <label
                                htmlFor={surveyId}
                                className={`
                                  h-6 w-6 absolute right-0 rounded border-2 border-primary flex items-center justify-center
                                  mr-2 cursor-pointer
                                  bg-bg
                                  peer-checked:bg-primary
                                  transition-colors
                                `}
                                onClick={() => handleUserItemClick(surveyId)}
                              >
                                {/* Häkchen-Icon */}
                                <svg
                                  className={`w-4 h-4 text-white ${
                                    !!checkedMap[surveyId]
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </label>
                            </div>
                          </div>
                        );
                      })
                    : "No Surveys yet"}
                </div>
              );
            })
          : "No Data"}
      </div>
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => assignShifts()}
      >
        Assing Shifts
      </button>
    </div>
  );
}
