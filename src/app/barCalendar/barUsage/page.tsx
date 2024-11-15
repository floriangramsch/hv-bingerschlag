"use client";

import Input from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useTakeBar } from "@/composables/useBar";
import { useState } from "react";

const BarUsage = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [title, setTitle] = useState<string>("");

  const takeBarMutation = useTakeBar();

  return (
    <>
      <Toast />
      <div className="mt-28 flex flex-col justify-center border-2 border-primary p-5 rounded shadow">
        <span>Title</span>
        <Input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        {/* <input
          className="text-black"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        /> */}
        <span>Start Time</span>
        <input
          type="datetime-local"
          className="bg-bg border-2 border-primary rounded p-2 text-white"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <br />
        <span>End Time</span>
        <input
          type="datetime-local"
          className="bg-bg border-2 border-primary rounded p-2 text-white mb-3"
          id="endDate"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
        <button
          className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
          onClick={() => takeBarMutation.mutate({ date, endDate, title })}
          disabled={takeBarMutation.isPending}
        >
          Use Bar
        </button>
      </div>
    </>
  );
};

export default BarUsage;
