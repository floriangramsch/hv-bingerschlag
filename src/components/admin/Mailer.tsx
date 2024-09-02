import { useState } from "react";

export default function Mailer() {
  const [mailNotification, setMailNotification] = useState("");

  const sendMails = () => {
    fetch("email/send")
      .then((response) => response.json())
      .then((data) => {
        setMailNotification(data);
        setTimeout(() => setMailNotification(""), 30000);
      });
  };

  return (
    <div className="my-4 border border-secondory rounded p-2 text-text shadow">
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => sendMails()}
      >
        Send Mails
      </button>
      {mailNotification && <div className="label">{mailNotification}</div>}
    </div>
  );
}
