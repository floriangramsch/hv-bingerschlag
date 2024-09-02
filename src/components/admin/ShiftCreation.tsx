"use client";

import React, { useState } from "react";

const ShiftCreation = () => {
  const [date, setDay] = useState(getTodayDate());
  const [endDate, setEndDay] = useState(getTodayDate());
  const [surveyShiftNotification, setSurveyShiftNotification] =
    useState<string>("");
  const [month, setMonth] = useState<number>(getNextMonth());
  const [specialEvent, setSpecialEvent] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("barTest");
  const [surveyNotification, setSurveyNotification] = useState<string>("");

  function getNextMonth() {
    const currentDate = new Date();
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return nextMonth.getMonth() + 1; // Monat beginnt bei 0 zu zählen, daher +1
  }

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Monate beginnen bei 0
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const createShift = () => {
    fetch("/api/admin/createShift", {
      method: "Post",
      body: JSON.stringify({ date, endDate, specialEvent, eventName }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setMonth(getNextMonth());
        setSurveyShiftNotification("Survey Shift created successfully!");
        setTimeout(() => setSurveyShiftNotification(""), 3000);
      });
  };

  const createMonth = () => {
    fetch("/api/admin/createMonth", {
      method: "Post",
      body: JSON.stringify(month),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setSurveyNotification("Survey created successfully!");
        setTimeout(() => setSurveyNotification(""), 3000);
      });
  };

  return (
    <div className="my-4 border border-secondory rounded p-2 text-text shadow">
      <span>Special Event</span>
      <input type="checkbox" onChange={() => setSpecialEvent(!specialEvent)} />
      <input
        className="text-black"
        hidden={!specialEvent}
        value={eventName}
        onChange={(event) => setEventName(event.target.value)}
      />
      <br />
      <span>Start Time</span>
      <input
        type="datetime-local"
        className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
        value={date}
        onChange={(event) => setDay(event.target.value)}
      />
      <br />
      <span>End Time</span>
      <input
        type="datetime-local"
        className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
        value={endDate}
        onChange={(event) => setEndDay(event.target.value)}
      />
      <button
        className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
        onClick={() => createShift()}
      >
        Create Shift
      </button>
      {surveyShiftNotification && (
        <div className="text-text text-xl mb-1 mr-3">
          {surveyShiftNotification}
        </div>
      )}
      <div className="mx-3 flex flex-col">
        <input
          className="bg-bg text-text border-2 border-primary rounded p-3 text-base mb-3"
          placeholder={String(month)}
          id="month"
          onChange={(event) => setMonth(Number(event.target.value))}
        />
        <button
          className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer"
          onClick={() => createMonth()}
        >
          Create Shift Month
        </button>
        {surveyNotification && (
          <div className="text-text text-xl mb-1 mr-3">
            {surveyNotification}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftCreation;
