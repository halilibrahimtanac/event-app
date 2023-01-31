import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EventList from "../components/Event/EventList";
import { categories } from "./NewEvent";
import "./styles/home.css";

const Home = () => {
  const { isLogged, userEvents } = useSelector((state) => state.auth);
  const [filteredEvents, setFilteredEvents] = useState(userEvents);
  const [clickedCategory, setClickedCategory] = useState();

  const onType = async (value) => {
    setFilteredEvents(
      userEvents.filter(
        (x) =>
          x.name.toLowerCase().includes(value) ||
          x.eventType.toLowerCase().includes(value) ||
          x.description.toLowerCase().includes(value)
      )
    );
  };

  const filterEvents = (value) => {
    setFilteredEvents(userEvents.filter((x) => x.eventType.includes(value)));
    setClickedCategory(value);
  };

  return (
    <div className="home-container">
      <Link
        className="w-[18vh] absolute mx-auto  bg-green-400 text-white rounded-md top-20 p-2"
        to="/new-event"
      >
        New Event
      </Link>

      <div className="w-1/4 h-auto z-10 absolute left-10 top-36 border-[1px] flex flex-col divide-y-[1px] box-border">
        <div
          onClick={() => filterEvents("")}
          className={
            "w-full cursor-pointer flex justify-between items-center p-2 hover:bg-gray-200 " +
            (clickedCategory === "" && "bg-gray-200")
          }
        >
          <label>All</label>
          <label>
            {userEvents?.reduce((prev, curr) => prev + 1, 0) + " events"}
          </label>
        </div>
        {categories.map((c) => (
          <div
            onClick={() => filterEvents(c.categoryName)}
            className={
              "w-full cursor-pointer flex justify-between items-center p-2 hover:bg-gray-200 " +
              (clickedCategory === c.categoryName && "bg-gray-200")
            }
          >
            <label
              className={
                "p-1 text-sm text-white font-bold rounded-3xl " +
                c.categoryColor
              }
            >
              {c.categoryName}
            </label>
            <label>
              {userEvents?.reduce((prev, curr) => {
                if (curr.eventType === c.categoryName) {
                  return prev + 1;
                }
                return prev;
              }, 0) + " events"}
            </label>
          </div>
        ))}
      </div>
      {isLogged ? (
        <div className="w-auto relative flex flex-col items-center gap-4 top-[10vh]">
          <div className="w-1/4 border-[1px] flex items-center justify-between box-border p-2">
            <input
              placeholder="Event name, event type or description..."
              type="text"
              className="w-full outline-none text-sm"
              onChange={(e) => onType(e.target.value)}
            />
            <img
              className="w-5 h-5"
              src="http://localhost:5000/uploads/images/search.png"
            />
          </div>
          <EventList
            home="true"
            containerWidth="w-[300vh]"
            listType="flex flex-col-reverse"
            eventItemWidth="w-1/4"
            userEvents={filteredEvents}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
