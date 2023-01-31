import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeEvent, updateReports } from "../store/auth-slice";

const UserCard = ({ user, reportDesc }) => {
  return (
    <div className="w-full h-auto relative flex flex-col gap-2">
      {reportDesc.length > 0 ? (
        <h1>
          <strong>Report Description:</strong> {reportDesc}
        </h1>
      ) : null}
      <img
        className="w-1/3 h-1/3 block mx-auto"
        src={`http://localhost:5000/${
          user.profilePic.length > 0
            ? user.profilePic
            : "uploads/images/default.png"
        }`}
      />
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Name:</label>
        <label>{user.name}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">User Name:</label>
        <Link to={`/user/${user._id}`}>{user.userName}</Link>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Gender:</label>
        <label>{user.gender}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Birth Date:</label>
        <label>{user.birthDate}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Location:</label>
        <label>{user.location}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Description:</label>
        <label>{user.description}</label>
      </div>
    </div>
  );
};

const EventCard = ({ event, reportDesc }) => {
  return (
    <div className="w-full h-auto relative flex flex-col gap-2">
      {reportDesc.length > 0 ? (
        <h1>
          <strong>Report Description:</strong> {reportDesc}
        </h1>
      ) : null}
      <img
        className="w-1/3 h-1/3 block mx-auto"
        src={`http://localhost:5000/${event.eventPic}`}
      />
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Name:</label>
        <label>{event.name}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Manager:</label>
        <Link to={`/user/${event.manager.userId}`}>
          {event.manager.userName}
        </Link>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Date:</label>
        <label>{event.date}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Type:</label>
        <label>{event.eventType}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Location:</label>
        <label>{event.eventLocation}</label>
      </div>
      <div className="w-auto h-auto text-sm flex justify-start gap-2">
        <label className="font-bold">Event Link:</label>
        <Link to={`/event/${event._id}`}>event</Link>
      </div>
    </div>
  );
};

const Chat = ({ messages }) => {
  return (
    <div className="w-full h-[50vh] overflow-scroll flex flex-col gap-1">
      {messages.map((m) => (
        <div className="w-1/2 h-auto flex flex-col border-[1px]">
          <label className="font-bold">
            {m.senderUserName ? m.senderUserName : null}
          </label>
          <label>{m.message}</label>
        </div>
      ))}
    </div>
  );
};

const Report = () => {
  const dispatch = useDispatch();
  const { reports, user } = useSelector((state) => state.auth);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState();
  const [clicked, setClicked] = useState([]);

  const banHandler = async (id, reportId) => {
    const banRes = await fetch("http://localhost:5000/report/ban-event", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const banJ = await banRes.json();
    dispatch(updateReports(reportId));
    dispatch(removeEvent(id));
    alert(banJ.message);
  };

  const banUserHandler = async (id, reportId) => {
    const banRes = await fetch("http://localhost:5000/report/ban-user", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const banJ = await banRes.json();
    dispatch(updateReports(reportId));
    alert(banJ.message);
  };
  const fetchHandler = async (desc, type, id, reportId) => {
    console.log(id);
    switch (type) {
      case "event-report":
        setLoading(true);
        const eventRes = await fetch("http://localhost:5000/event/event/" + id);
        const eventJson = await eventRes.json();
        setClicked([
          <EventCard reportDesc={desc} event={eventJson} />,
          <Chat messages={eventJson.chat} />,
          <button
            onClick={() => banHandler(id, reportId)}
            className="absolute p-2 bg-red-500 text-sm left-[50%] top-[-10vh] text-white"
          >
            Ban Event
          </button>,
        ]);
        setLoading(false);
        break;
      case "user-report":
        const userRes = await fetch("http://localhost:5000/user/uid/" + id);
        const userJson = await userRes.json();

        const messagesRes = await fetch(
          "http://localhost:5000/chat/user-messages",
          {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const messagesJs = await messagesRes.json();
        setClicked([
          <UserCard user={userJson} reportDesc={desc} />,
          <Chat messages={messagesJs} />,
          <button
            onClick={() => banUserHandler(id, reportId)}
            className="absolute p-2 bg-red-500 text-sm left-[50%] top-[-10vh] text-white"
          >
            Ban User
          </button>,
        ]);
    }
  };

  const filterReports = (value) => {
    const filtered = reports.filter((x) => x.reportType === value);
    setFiltered(filtered);
  };
  return (
    <div className="w-[70%] h-[50vh] relative border-2 flex justify-between mx-auto top-[20vh]">
      <div className="w-1/3 h-full relative flex flex-col">
        <div className="w-full h-auto relative flex">
          <button
            onClick={() => filterReports("event-report")}
            className="w-1/2 border-b-[1px] border-b-white hover:border-b-slate-300 active:bg-slate-300 text-center"
          >
            Event
          </button>
          <button
            onClick={() => filterReports("user-report")}
            className="w-1/2 border-b-[1px] border-b-white hover:border-b-slate-300 active:bg-slate-300 text-center"
          >
            User
          </button>
        </div>
        <div className="w-full h-auto p-2 divide-y-[1px]">
          {filtered.map((r) => (
            <div
              className="flex flex-col text-left"
              onClick={() =>
                fetchHandler(r?.reportDesc, r?.reportType, r?.reported, r?._id)
              }
            >
              <label>{r?.reportType}</label>
              <Link to={`/user/${r?.reporter}`}>
                <strong>Reporter: </strong>
                {r?.reporter}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {!loading && clicked[2]}

      <div className="w-1/3 h-auto relative ">
        {loading ? <label>loading...</label> : clicked[0]}
      </div>

      <div className="w-1/3 h-auto relative">
        {loading ? <label>loading...</label> : clicked[1]}
      </div>
    </div>
  );
};

export default Report;
