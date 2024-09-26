"use client";

import Survey from "@/components/Survey";
import React from "react";
import { TSurvey } from "../helpers/types";
import { useQuery } from "@tanstack/react-query";

export default function SurveyOverview() {
  const {
    data: surveys,
    isLoading,
    error,
  } = useQuery<Record<string, TSurvey[]>>({
    queryKey: ["surveys"],
    queryFn: async () => {
      const response = await fetch("/api/surveys/getSurveys");
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      return await response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading surveys</div>;

  return (
    <div className="grid grid-cols-2">
      {surveys &&
        Object.entries(surveys).map(([name, surveys]) => {
          return <Survey key={name} name={name} surveys={surveys} />;
        })}
    </div>
  );
}
