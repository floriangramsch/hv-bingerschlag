"use client";

import React from "react";
import { convertDate } from "../helpers/functions";
import { Toast } from "@/components/ui/Toast";
import Loading from "@/components/Loading";
import { useAssignShiftsMutation } from "@/composables/useShifts";
import { useGetSurveysToAssign } from "@/composables/useSurveys";

export default function ShiftAssignment() {
  const { data: shifts, isLoading, error } = useGetSurveysToAssign();

  const mutation = useAssignShiftsMutation();

  const assignShifts = () => {
    const shiftOptions = Array.from(
      document.getElementsByName("shiftOption")
    ) as HTMLInputElement[];
    const filtered = shiftOptions.reduce<Record<string, boolean>>(
      (acc, checkbox) => {
        console.log(checkbox);
        acc[checkbox.id] = checkbox.checked;
        return acc;
      },
      {}
    );
    mutation.mutate(filtered);
  };

  const handleUserItemClick = (surveyId: string, surveyShiftId: string) => {
    const checkboxId = `${surveyId}`;
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading surveys</div>;

  return (
    <div className="p-2">
      <Toast />
      <div className="grid grid-cols-2 gap-1">
        {shifts
          ? Object.entries(shifts).map(([surveyShiftId, data]) => {
              return (
                <div
                  className="my-4 border border-secondory rounded p-3 text-text shadow"
                  key={surveyShiftId}
                  style={{
                    margin: "0",
                    // marginRight: schicht === "1" ? "10px" : "0",
                  }}
                >
                  <h3>{convertDate(new Date(data.date))}</h3>
                  <h4>{data.specialEvent ? data.specialName : <br />}</h4>
                  {data.surveys && Object.keys(data.surveys).length > 0
                    ? Object.entries(data.surveys).map(([surveyId, user]) => {
                        return (
                          <div
                            key={surveyId}
                            className="p-1 mb-1 border border-primary rounded"
                            onClick={() =>
                              handleUserItemClick(surveyId, surveyShiftId)
                            }
                            style={{
                              borderColor:
                                user.availability === 1 ? "green" : "red",
                            }}
                          >
                            {user.user} {user.assigned}
                            <input
                              type="checkbox"
                              name="shiftOption"
                              id={surveyId}
                              checked={user.assigned}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUserItemClick(surveyId, surveyShiftId);
                              }}
                            />
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
