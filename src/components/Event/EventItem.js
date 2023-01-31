import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../pages/NewEvent";
import "./event-item.css";

const EventItem = (props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${props.event._id}`)}
      className={"event cursor-pointer " + props.eventItemWidth}
    >
      <img
        alt={props.event.eventPic}
        className={
          "event-img " + (props.home === "true" ? "h-[45vh]" : "h-[30vh]")
        }
        src={`http://localhost:5000/${props.event.eventPic}`}
      />

      <div className="event-details ">
        <div className="event-header">
          <label
            className={
              "event-type " +
              (categories.find((x) => x.categoryName === props.event.eventType)
                .categoryColor || "bg-green-400")
            }
          >
            {props.event.eventType ? props.event.eventType : "Entertainment"}
          </label>

          <label className="flex gap-1 items-center">
            <img
              alt="logo"
              className="w-4 h-4 relative"
              src="http://localhost:5000/uploads/images/calender.png"
            />
            {new Date(props.event.date).getDate() +
              "." +
              (new Date(props.event.date).getMonth() + 1) +
              "." +
              new Date(props.event.date).getFullYear()}
          </label>
        </div>

        <h2 className="event-title">{props.event.name}</h2>

        <p className="w-full whitespace-nowrap text-left overflow-hidden text-ellipsis">
          {props.event.description}
        </p>

        <div className="event-footer">
          <div className="event-creator">
            <img
              alt="logo"
              className="logo"
              src="http://localhost:5000/uploads/images/default.png"
            />
            <label>{props.event.manager.userName}</label>
          </div>

          <div className="event-participators">
            <img
              alt="logo"
              className="logo"
              src="http://localhost:5000/uploads/images/participators.png"
            />
            {props.event.participators.length + props.event.moderators.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
