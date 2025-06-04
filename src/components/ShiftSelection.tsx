import { convertDate } from "@/app/helpers/functions";
import { TSelectUser, TShift } from "@/app/helpers/types";
import useSendTelegram from "@/composables/useSendTelegram";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import Loading from "./Loading";
import BetterSelect from "./ui/BetterSelect";
import { useAddSurvery } from "@/composables/useSurveys";
import { bread } from "./ui/Toast";

export default function ShiftSelection({ user }: { user: TSelectUser }) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >([]);
  const [locked, setLocked] = useState(false);

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
    staleTime: 1000 * 60 * 5,
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
  const surveyMutation = useAddSurvery();

  const addSurvey = () => {
    setLocked(true);
    surveyMutation.mutate(
      { userId: user.value, choices: selectedOptions },
      {
        onSettled: () => setLocked(false),
        onSuccess: () => {
          sendTelegram.mutate(user.first_name + " hat sich eingetragen");
          window.location.href = "/surveyOverview";
        },
        onError: (error) => {
          bread("There was an error adding your survey: " + error);
          console.error("There was an error adding your survey: ", error);
        },
      }
    );
  };

  const options = [
    { value: "true", label: "Sure can do!" },
    { value: "false", label: "Nope, I'm out!" },
    { value: "maybe", label: "If necessary!" },
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

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading shifts</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="flex text-center justify-center border-none rounded text-xl p-4 mt-4 mb-4 bg-primary font-bold">
        Welcome {user.first_name}
      </div>
      <div className="flex flex-col mb-2">
        {shifts?.map(
          ({ id, specialEvent, specialName, date, availability }) => {
            return (
              <div
                className={`flex grid-cols-2 justify-between items-center p-1 m-0 ${
                  specialEvent ? "" : ""
                } `}
                key={id}
              >
                <span
                  style={{
                    paddingRight: "2rem",
                  }}
                >
                  {convertDate(new Date(date))}
                  <br />
                  {specialEvent ? (
                    <span className="font-bold">Special: </span>
                  ) : (
                    ""
                  )}{" "}
                  {specialName}
                </span>
                <BetterSelect
                  id={id}
                  options={options}
                  onChange={(e) => e && onSelectChange(id, e)}
                  defaultValue={getOptionByAvailability(availability)}
                />
              </div>
            );
          }
        )}
        {shifts && (
          <button
            className="inline-block py-2 px-4 m-4 text-lg text-bold text-white bg-button border-none rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addSurvey}
            disabled={surveyMutation.isPending || locked}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
