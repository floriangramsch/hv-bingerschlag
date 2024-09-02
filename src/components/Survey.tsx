import { convertDate } from "@/app/helpers/functions";
import { TSurvey } from "@/app/helpers/types";
import React from "react";

export default function Survey({
  name,
  surveys,
}: {
  name: string;
  surveys: TSurvey[];
}) {
  return (
    <>
      <div className="my-2 border-2 border-secondory rounded p-2 text-text shadow">
        <h4 className="text-xl font-bold mb-2">{name}</h4>
        <div>
          {surveys.map(
            ({ id, date, availability, special_name }) => {
              return (
                <div key={id} className="mb-2">
                  <div>
                    {id && convertDate(new Date(date))}
                    <br />
                    {id && special_name && special_name}
                  </div>
                  <div className="italic text-primary">
                    {id ? (() => {
                      switch (availability) {
                        case -1:
                          return "Kann nicht!";
                        case 0:
                          return "Wenn's sein muss!";
                        case 1:
                          return "Kann da sein!";
                        case 99:
                          return "Weiß es nicht!";
                        default:
                          return "Wrong availability!";
                      }
                    })(): "Nicht eingetragen"}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
