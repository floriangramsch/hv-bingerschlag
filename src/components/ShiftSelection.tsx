import { convertDate } from "@/app/helpers/functions";
import { TSelectUser, TShift } from "@/app/helpers/types";
import useSendTelegram from "@/app/helpers/useSendTelegram";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import Select from "react-select";

export default function ShiftSelection({ user }: { user: TSelectUser }) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >([]);

  const {
    data: shifts,
    isLoading,
    error,
  } = useQuery<TShift[]>({
    queryKey: ["unassignedShifts", user.value],
    queryFn: async () => {
      const response = await fetch("/api/shifts/getUnassignedShifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: String(user.value),
      });
      const unassignedShifts: TShift[] = await response.json();
      const opts: Record<number, string> = {};
      unassignedShifts.forEach((unassignedShift) => {
        if (unassignedShift.availability !== undefined) {
          switch (unassignedShift.availability) {
            case -1:
              opts[unassignedShift.id] = "false";
              break;
            case 0:
              opts[unassignedShift.id] = "maybe";
              break;
            case 1:
              opts[unassignedShift.id] = "true";
              break;
            case 99:
              opts[unassignedShift.id] = "dontknow";
              break;
            default:
              break;
          }
        }
      });
      setSelectedOptions(opts);
      return unassignedShifts;
    },
  });

  const onSelectChange = (
    shift_id: number,
    option: { value: string; label: string }
  ) => {
    setSelectedOptions({
      ...selectedOptions,
      [shift_id]: option.value,
    });
  };

  const sendTelegram = useSendTelegram();

  const addSurvey = () => {
    const data = JSON.stringify([user.value, selectedOptions]);

    fetch("/api/surveys/addSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then(async () => {
        sendTelegram.mutate(user.first_name + " hat sich eingetragen", {
          onSuccess: () => (window.location.href = "/surveyOverview"),
        });
      })
      .catch((e) => console.error("Fehler beim Hinzufügen der Umfrage:", e));
  };

  const options = [
    { value: "true", label: "Sure can do!" },
    { value: "false", label: "Nope, I'm out!" },
    { value: "maybe", label: "Only if necessary!" },
    { value: "dontknow", label: "Dont know!" },
  ];

  const getOptionByAvailability = (availability: number | undefined) => {
    switch (availability) {
      case -1:
        return options[1];
      case 0:
        return options[2];
      case 1:
        return options[0];
      case 99:
        return options[3];
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shifts</div>;

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex text-center justify-center border-none rounded text-xl p-4 mt-1 mb-4 bg-primary font-bold">
          Welcome {user.first_name}
        </div>
        <div className="flex flex-col mb-2">
          {shifts?.map(
            ({ id, specialEvent, specialName, date, availability }) => {
              return (
                <div
                  className="flex grid-cols-2 justify-between "
                  key={id}
                  style={{
                    backgroundColor: specialEvent ? "#1f2b37" : "inherit",
                  }}
                >
                  <span
                    style={{
                      paddingRight: "2rem",
                    }}
                  >
                    {convertDate(new Date(date))}
                    <br />
                    {specialName && specialName}
                  </span>
                  <Select
                    id={String(id)}
                    className="select-control text-black"
                    classNamePrefix="select"
                    options={options}
                    defaultValue={getOptionByAvailability(availability)}
                    onChange={(e) => e && onSelectChange(id, e)}
                  />
                </div>
              );
            }
          )}
          {shifts && (
            <button
              className="inline-block py-2 px-4 m-4 text-lg text-bold text-white bg-button border-none rounded cursor-pointer"
              onClick={addSurvey}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
}
