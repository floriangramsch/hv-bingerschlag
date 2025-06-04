import { TShiftsToAssign, TSurvey } from "@/app/helpers/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetSurveys() {
  return useQuery<Record<string, TSurvey[]>>({
    queryKey: ["surveys"],
    queryFn: async () => {
      const response = await fetch("/api/surveys/getSurveys");
      if (!response.ok) {
        throw new Error("Failed to fetch surveys");
      }
      return await response.json();
    },
  });
}

export function useGetSurveysToAssign() {
  return useQuery<TShiftsToAssign>({
    queryKey: ["surveysToAssign"],
    queryFn: async () => {
      const response = await fetch("/api/admin/getSurveysToAssign");
      return await response.json();
    },
  });
}

export function useAddSurvery() {
  return useMutation({
    mutationFn: async (data: {
      userId: number;
      choices: Record<number, string>;
    }) => {
      await fetch("/api/surveys/addSurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([data.userId, data.choices]),
      });
    },
  });
}
