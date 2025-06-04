import { TAssignedShifts, TShiftsToAssign } from "@/app/helpers/types";
import { bread } from "@/components/ui/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetShift(id: string | string[] | undefined) {
  return useQuery({
    queryKey: ["shift", id],
    queryFn: async () => {
      const response = await fetch(`/api/shifts?id=${id}`);
      const shifts = await response.json();
      const shift = shifts[0];
      return shift;
    },
    enabled: !!id,
  });
}

export function useGetAssignedShifts({
  year,
  month,
  special,
}: {
  year: number;
  month: number;
  special: boolean;
}) {
  return useQuery<TAssignedShifts[]>({
    queryKey: ["assignedShifts", year, month, special],
    queryFn: async () => {
      const response = await fetch("/api/shifts/getShifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, month, special }),
      });
      return await response.json();
    },
  });
}

export function useAssignShiftsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filtered: Record<string, boolean>) => {
      const response = await fetch("/api/admin/assignShifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filtered),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data === "Already Full") {
        bread("Already full");
      } else {
        bread("Successfully assigned the shifts!");
        window.location.href = "/shiftPlan";
      }
      queryClient.invalidateQueries({ queryKey: ["surveysToAssign"] });
    },
    onError: (error: Error) => {
      console.error("Fehler beim Hinzufügen der Schichten:", error);
    },
  });
}

export function useRemoveShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | string[]) => {
      const response = await fetch(`/api/shifts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete shift");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["shifts"] });
    },
    onError: (e) => bread(e.message),
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData: {
      id: string | string[];
      date: string;
      endDate: string;
      worker1_id: string;
      worker2_id: string;
      specialName: string;
    }) => {
      const response = await fetch(`/api/shifts/updateShift`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          id: updatedData.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update shift");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["shifts"] });
      bread("Shift successfully updated!");
    },
    onError: (error) => {
      console.error("Error updating shift:", error);
    },
  });
}

export const useCreateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      date: string;
      endDate: string;
      specialEvent: boolean;
      eventName: string;
    }) => {
      const response = await fetch("/api/admin/createShift", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create shift");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
};

export function useCreateMonthMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (month: number) => {
      const response = await fetch("/api/admin/createMonth", {
        method: "POST",
        body: JSON.stringify(month),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create month");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (error: Error) => {
      bread(error.message);
    },
  });
}
