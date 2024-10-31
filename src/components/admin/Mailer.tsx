import useSendTelegram from "@/app/helpers/useSendTelegram";
import { useState } from "react";
import { bread, Toast } from "../ui/Toast";

export default function Mailer() {
  const sendTelegram = useSendTelegram();

  const sendTelegramMessage = () => {
    sendTelegram.mutate("test", {
      onSuccess: (data) => {
        bread(data.message);
      },
      onError: (error) => {
        console.error("Error sending mails:", error);
        bread("Failed to send mails");
      },
    });
  };

  return (
    <div className="my-4 border border-secondory rounded p-2 text-text shadow">
      <Toast />
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => sendTelegramMessage()}
      >
        Send Mails
      </button>
    </div>
  );
}
