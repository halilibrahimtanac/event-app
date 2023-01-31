import React from "react";
import EventItem from "./EventItem";

const EventList = (props) => {
  return (
    <div
      className={
        props.containerWidth +
        " h-auto relative " +
        props.listType +
        " justify-between rounded-md items-center gap-7 box-border top-3"
      }
    >
      {props.userEvents.map((e, i) => {
        return (
          <EventItem
            home={props.home}
            eventItemWidth={props.eventItemWidth}
            key={i}
            event={e}
          />
        );
      })}
    </div>
  );
};

export default EventList;
