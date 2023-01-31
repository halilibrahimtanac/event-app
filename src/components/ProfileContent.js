import React, { useState } from "react";
import EventList from "./Event/EventList";

const ProfileContent = ({ events, participatedEvents }) => {
  const [clicked, setClicked] = useState(0);
  return (
    <div>
      <ul className="w-1/2 h-auto relative mt-[10vh] grid grid-cols-3 box-border mx-auto">
        <li
          className={clicked === 0 && "border-b-[1px]"}
          onClick={() => setClicked(0)}
        >
          Events
        </li>
        <li
          className={clicked === 1 && "border-b-[1px]"}
          onClick={() => setClicked(1)}
        >
          Participated
        </li>
      </ul>

      <div className="w-1/2 h-auto mx-auto">
        {clicked === 0 && (
          <EventList
            home="false"
            containerWidth="w-full"
            listType="grid grid-cols-2"
            eventItemWidth="w-full"
            userEvents={events}
          />
        )}
        {clicked === 1 && (
          <EventList
            home="false"
            containerWidth="w-full"
            listType="grid grid-cols-2"
            eventItemWidth="w-full"
            userEvents={participatedEvents}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
