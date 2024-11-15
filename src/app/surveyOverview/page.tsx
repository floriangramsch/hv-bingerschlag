"use client";

import Survey from "@/components/Survey";
import React from "react";
import Loading from "@/components/Loading";
import { useGetSurveys } from "@/composables/useSurveys";

export default function SurveyOverview() {
  const { data: surveys, isLoading, error } = useGetSurveys();

  if (isLoading) return <Loading />;
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
