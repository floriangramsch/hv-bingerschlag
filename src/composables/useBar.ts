import { bread } from "@/components/ui/Toast";
import { useMutation } from "@tanstack/react-query";

export function useTakeBar() {
  return useMutation({
    mutationFn: async ({
      date,
      endDate,
      title,
    }: {
      date: string;
      endDate: string;
      title: string;
    }) => {
      const response = await fetch("/api/events/useBar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, endDate, title }),
      });
      if (!response.ok) {
        throw new Error("Failed to use bar");
      }
      return response.json();
    },
    onSuccess: () => {
      window.location.href = "/barCalendar";
    },
    onError: (error: Error) => {
      bread(error.message);
    },
  });
}
