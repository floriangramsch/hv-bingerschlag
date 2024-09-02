"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de-ch";
import "@/app/calendar.css";
import { useCallback, useEffect, useState } from "react";
import { TCombinedEvents, TEvents } from "../helpers/types";

const localizer = momentLocalizer(moment);

const BarCalendar = () => {
  const [events, setEvents] = useState<TCombinedEvents>([]);
  const [view, setView] = useState<View>(Views.MONTH);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );

  useEffect(() => {
    getView();
  }, []);

  const getView = () => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data: TEvents) => {
        const events = Object.entries(data.shifts).map(([id, event]) => {
          const startDate = moment(event.date).toDate();
          const endDate = moment(event.endDate).toDate();
          return {
            id: id,
            title: event.eventName,
            start: startDate,
            end: endDate,
          };
        });
        const usage = Object.entries(data.usage).map(([id, event]) => {
          const startDate = moment(event.date).toDate();
          const endDate = moment(event.endDate).toDate();
          return {
            id: id,
            title: event.eventName,
            start: startDate,
            end: endDate,
          };
        });
        const combinedEvents = [...events, ...usage];
        setEvents(combinedEvents);
      });
  };

  return (
    <div>
      <a href="/barCalendar/barUsage">
        <button className="inline-block px-5 py-3 bg-button m-4 text-base font-bold text-text border-none rounded cursor-pointer">
          Use Bar
        </button>
      </a>
      <Calendar
        date={date}
        className="w-screen"
        style={{ height: 600 }}
        localizer={localizer}
        onNavigate={onNavigate}
        events={events}
        startAccessor={"start"}
        endAccessor={"end"}
        // endAccessor={(event: {
        //   id: string;
        //   start: Date;
        //   end: Date;
        //   title: string;
        // }) => {
        //   console.log(event);
        //   // Check if the event ends on the next day but before 1 AM
        //   return moment(event.end);
        //   if (
        //     moment(event.end).isAfter(moment(event.start).endOf("day")) &&
        //     moment(event.end).isBefore(
        //       moment(event.start).add(1, "day").hour(2)
        //     )
        //   ) {
        //     return moment(event.start).endOf("day");
        //   }
        //   return moment(event.end);
        // }}
        defaultView="month"
        view={view}
        views={["month", "day", "agenda"]}
        showMultiDayTimes
        onView={handleOnChangeView}
      />
    </div>
  );
};

export default BarCalendar;
