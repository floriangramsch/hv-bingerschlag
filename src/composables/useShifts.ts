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
    enabled: !!id, // Only run the query if id is available
  });
}

export function useRemoveShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
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
