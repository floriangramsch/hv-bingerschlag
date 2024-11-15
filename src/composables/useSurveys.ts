import { TShiftsToAssign, TSurvey } from "@/app/helpers/types";
import { useQuery } from "@tanstack/react-query";

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
