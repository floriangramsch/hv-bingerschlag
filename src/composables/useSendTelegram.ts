import { useMutation } from "@tanstack/react-query";

const useSendTelegram = () =>
  useMutation({
    mutationFn: async (msg: string) => {
      const response = await fetch("https://telegram.floxsite.de/barMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

export default useSendTelegram;
