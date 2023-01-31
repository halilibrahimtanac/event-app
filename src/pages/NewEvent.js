import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import { addEvent } from "../store/auth-slice";
import "./styles/new-event.css";

export const categories = [
  {
    categoryName: "Entertainment",
    categoryColor: "bg-green-400",
  },
  {
    categoryName: "Education",
    categoryColor: "bg-red-400",
  },
  {
    categoryName: "Technology",
    categoryColor: "bg-gray-400",
  },
  {
    categoryName: "Concert",
    categoryColor: "bg-yellow-400",
  },
  {
    categoryName: "Political",
    categoryColor: "bg-blue-400",
  },
];

const NewEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    eventType: "",
    eventLocation: "",
    eventPic: null,
    description: "",
  });
  const newEventHandler = async (e) => {
    e.preventDefault();
    if (!Object.values(newEvent).includes("" || null)) {
      const formData = new FormData();
      formData.append("name", newEvent.name);
      formData.append("date", newEvent.date);
      formData.append("eventType", newEvent.eventType);
      formData.append("eventLocation", newEvent.eventLocation);
      formData.append("image", newEvent.eventPic);
      formData.append("description", newEvent.description);
      formData.append("manager", user.userName);

      const newEventRes = await fetch("http://localhost:5000/event/new-event", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: user.token,
        },
      });

      if (newEventRes.ok) {
        const newEventResJson = await newEventRes.json();
        dispatch(addEvent(newEventResJson));
        navigate("/");
        return;
      }
      alert(newEventRes.statusText);
      return;
    }
    alert("Don't left empty area");
  };
  return (
    <div className="new-event-container">
      <h1 className="relative top-8 text-2xl font-bold text-purple-400">
        New Event
      </h1>
      <form onSubmit={newEventHandler} className="new-event-form top-10">
        <Input
          className="input"
          inputClass="text"
          title="Event Name"
          inputType="text"
          inputName="name"
          onChangeHandler={(e) =>
            setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
          }
        />
        <Input
          className="input"
          inputClass="text"
          title="Event Date"
          inputType="date"
          inputName="date"
          onChangeHandler={(e) =>
            setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
          }
        />
        <div className="input">
          <label className="text-gray-600">Event Type</label>
          <select
            className="text"
            name="eventType"
            onChange={(e) =>
              setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
            }
          >
            <option></option>
            {categories.map((c) => (
              <option value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>
        </div>
        <Input
          className="input"
          inputClass="text"
          title="Event Location"
          inputType="text"
          inputName="eventLocation"
          onChangeHandler={(e) =>
            setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
          }
        />
        <Input
          className="input"
          inputClass="text"
          title="Event Picture"
          inputType="file"
          inputName="eventPic"
          onChangeHandler={(e) =>
            setNewEvent({ ...newEvent, [e.target.name]: e.target.files[0] })
          }
        />
        <div className="input">
          <label className="text-gray-600">Description</label>
          <textarea
            className="text"
            name="description"
            onChange={(e) =>
              setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
            }
          ></textarea>
        </div>
        <button
          className="mt-3 mb-3 bg-purple-400 relative w-1/2 p-1 text-white font-bold active:bg-purple-700"
          type="submit"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default NewEvent;
