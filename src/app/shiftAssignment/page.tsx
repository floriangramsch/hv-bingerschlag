"use client";

import React, { useEffect, useState } from "react";
import { convertDate } from "../helpers/functions";
import { TShiftsToAssign } from "../helpers/types";

export default function ShiftAssignment() {
  const [shifts, setShifts] = useState<TShiftsToAssign>();

  useEffect(() => {
    getView();
  }, []);

  const getView = () => {
    fetch("/api/admin/getSurveysToAssign")
      .then((response) => response.json())
      .then((data: TShiftsToAssign) => setShifts(data));
  };

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
    console.log(shiftOptions);
    console.log(filtered);
    const data = JSON.stringify(filtered);

    fetch("/api/admin/assignShifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "Already Full") {
          window.alert("Already full");
        } else {
          window.location.href = "/shiftPlan";
        }
      })
      .catch((e) => console.error("Fehler beim Hinzufügen der Schichten:", e));
  };

  const handleUserItemClick = (surveyId: string, surveyShiftId: string) => {
    const checkboxId = `${surveyId}`;
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2">
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
                  {data.surveys
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
                    : "blub"}
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
    </>
  );
}
