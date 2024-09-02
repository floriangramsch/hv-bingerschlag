"use client";

import Survey from "@/components/Survey";
import React, { useEffect, useState } from "react";
import { TSurvey } from "../helpers/types";

export default function SurveyOverview() {
  const [surveys, setSurveys] = useState<Record<string, TSurvey[]>>({});

  useEffect(() => {
    getSurveys();
  }, []);

  const getSurveys = () => {
    fetch("/api/surveys/getSurveys")
      .then((response) => response.json())
      .then((data: Record<string, TSurvey[]>) => {
        setSurveys(data);
      });
  };

  return (
    <div className="grid grid-cols-2">
      {Object.entries(surveys).map(([name, surveys]) => {
        return <Survey key={name} name={name} surveys={surveys} />;
      })}
    </div>
  );
}
