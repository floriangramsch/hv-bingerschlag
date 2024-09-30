import useSendTelegram from "@/app/helpers/useSendTelegram";
import { useState } from "react";

export default function Mailer() {
  const [mailNotification, setMailNotification] = useState("");

  const sendTelegram = useSendTelegram();

  const sendTelegramMessage = () => {
    sendTelegram.mutate("test", {
      onSuccess: (data) => {
        setMailNotification(data.message);
        setTimeout(() => setMailNotification(""), 3000);
      },
      onError: (error) => {
        console.error("Error sending mails:", error);
        setMailNotification("Failed to send mails");
        setTimeout(() => setMailNotification(""), 3000);
      },
    });
  };

  return (
    <div className="my-4 border border-secondory rounded p-2 text-text shadow">
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => sendTelegramMessage()}
      >
        Send Mails
      </button>
      {mailNotification && <div className="label">{mailNotification}</div>}
    </div>
  );
}
