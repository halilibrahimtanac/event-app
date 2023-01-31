import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../components/Chat";
import Participators from "../components/Event/Participators";
import Dialog from "../components/UI/Dialog";
import Modal from "../components/UI/Modal";
import {
  removeEvent,
  updateEvent,
  updatePendingJoinReqs,
} from "../store/auth-slice";
import "./styles/event.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Event = () => {
  const [isShow, setShow] = useState(false);
  const [chatShow, setChatShow] = useState(false);
  const [report, setReport] = useState({
    isShow: false,
    input: "",
  });
  const [dialog, setDialog] = useState({
    title: "",
    isShow: false,
    handler: null,
  });
  const [notifyBox, setNotifyBox] = useState({
    isShow: false,
    body: "",
  });
  const [foundUsers, setFoundUsers] = useState([]);
  const id = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const pendingJoinReqs = useSelector((state) => state.auth.pendingJoinReqs);
  const event = useSelector((state) =>
    state.auth.userEvents.find((x) => x._id === id)
  );
  const [managerPic, setManagerPic] = useState();

  useEffect(() => {
    fetch("http://localhost:5000/user/profile-pic/" + event.manager.userId)
      .then((res) => res.json())
      .then((rj) => setManagerPic(rj));
  }, []);

  const searchHandler = async (value) => {
    const response = await fetch("http://localhost:5000/user/" + value, {
      headers: {
        Authorization: user.token,
      },
    });

    let json = await response.json();
    if (json.message) return alert("Error");
    console.log("unfiltered: ", json);
    json = json.filter(
      (x) => !event.participators.some((p) => p.userId === x._id)
    );
    console.log("filtered: ", json);
    setFoundUsers(json.filter((x) => x._id !== event.manager.userId));
  };

  const kickParticipator = async (p, type) => {
    const response = await fetch(
      `http://localhost:5000/event/${event._id}/${type}/${p.userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: user.token,
        },
      }
    );

    const json = await response.json();
    if (json.error) alert(json.error);

    dispatch(updateEvent(json));
    setDialog({ isShow: false, title: "", handler: null });
    console.log(json);
  };

  const unrole = async (m) => {
    const response = await fetch(
      `http://localhost:5000/event/${event._id}/moderators/${m.userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(m),
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      }
    );

    const json = await response.json();
    if (json.error) alert(json.error);

    dispatch(updateEvent(json));
    console.log(json);
  };

  const addParticipatorHandler = async (u, type, method) => {
    console.log(u);
    const url =
      `http://localhost:5000/event/${id}/participators` +
      (type === "newPar" ? "" : `/${u.userId}`);
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        userId: type === "newPar" ? u._id : u.userId,
        userName: u.userName,
        profilePic: u.profilePic,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const json = await response.json();
    if (json.error) alert(json.error);

    console.log(json);
    dispatch(updateEvent(json));
    setShow(false);
    setFoundUsers([]);
    setDialog({ isShow: false, title: "", handler: null });
  };

  const sendInvitation = async (uid, userName) => {
    const url = `http://localhost:5000/event/${id}/participator-invitation`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        notifyType: "event-invitation",
        from: { senderId: user._id, senderName: user.userName },
        sendedId: uid,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const rejs = await res.json();
    console.log(rejs);
    setShow(false);

    setNotifyBox({
      isShow: true,
      body: `Invitation sended to ${userName}`,
    });
    setTimeout(() => {
      setNotifyBox({ isShow: false, body: "" });
    }, 3000);

    setFoundUsers([]);
  };

  const joinRequestHandler = async (eventId, userName, managerId) => {
    const joinRes = await fetch("http://localhost:5000/event/event-join-req", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        userName,
        managerId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });
    if (joinRes.ok) {
      const joinJson = await joinRes.json();
      dispatch(updatePendingJoinReqs(joinJson));
      return;
    }
    alert(joinRes.statusText);
  };

  const leaveEvent = async (type) => {
    const leaveRes = await fetch(`http://localhost:5000/event/events${type}`, {
      method: "PATCH",
      headers: {
        Authorization: user.token,
      },
    });

    const leaveJson = await leaveRes.json();
    if (leaveJson.error) return alert(leaveJson.error);
    console.log("leaved event: ", leaveJson);
    if (!leaveJson.message) {
      dispatch(updateEvent(leaveJson));
    } else {
      dispatch(removeEvent(event._id));
    }
    navigate("/");
  };

  const reportHandler = async () => {
    const reportRes = await fetch("http://localhost:5000/report", {
      method: "POST",
      body: JSON.stringify({
        reportType: "event-report",
        reporter: user._id,
        reported: event._id,
        reportDesc: report.input,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const reportJson = await reportRes.json();
    console.log("reported : ", reportJson);
    setReport({ isShow: false, input: "" });
  };

  return (
    <div className="event-main-container">
      {isShow && (
        <Modal className="box" overlay="overlay" setShow={setShow}>
          <h1 className="text-xl mb-5">Add new participator</h1>
          <input
            className="search"
            type="text"
            onChange={(e) => searchHandler(e.target.value)}
          />
          {foundUsers.map((u) => (
            <div className="w-1/2 h-auto flex border-2 justify-between">
              <label>{u.userName}</label>{" "}
              {pendingJoinReqs.some(
                (x) =>
                  (x.from.senderId === u._id || x.to === u._id) &&
                  x.extraInfo === event._id
              ) ? (
                <label>pending...</label>
              ) : (
                <button onClick={() => sendInvitation(u._id, u.userName)}>
                  Add+
                </button>
              )}
            </div>
          ))}
        </Modal>
      )}

      {dialog.isShow && (
        <Dialog
          className="w-1/3 h-[30vh] absolute bg-slate-100 z-10 left-1/3 top-1/2 translate-y-[-50%] flex justify-center items-center p-4"
          overlay="overlay"
          title={dialog.title}
          onClickHandler={dialog.handler}
          showHandler={() => setDialog({ ...dialog, isShow: false })}
        />
      )}

      {report.isShow && (
        <Modal
          className="box"
          overlay="overlay"
          setShow={(value) => setReport({ isShow: value, input: "" })}
        >
          <h1 className="relative top-[10vh] w-[70%] text-left">
            Report description:
          </h1>
          <input
            className="relative top-[10vh] border-[1px] p-3 w-[70%] text-sm"
            value={report.input}
            type="text"
            onChange={(e) => setReport({ ...report, input: e.target.value })}
          />
          <div className="w-[70%] relative flex justify-between top-[15vh]">
            <button
              className="bg-red-500 p-1 text-white"
              onClick={() => reportHandler()}
            >
              Report
            </button>
            <button
              className="bg-slate-300 p-1"
              onClick={() => setReport({ isShow: false, input: "" })}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      <button
        onClick={() => setReport({ ...report, isShow: true })}
        className="bg-red-500 absolute left-0 top-[10vh] text-xs text-white p-2"
      >
        Report This Event
      </button>

      {notifyBox.isShow && (
        <Modal className="notify">
          <h1 className="text-gray-500">{notifyBox.body}</h1>
        </Modal>
      )}
      <div className="infos-container">
        <div className="details-container">
          <img src={`http://localhost:5000/${event.eventPic}`} />

          <div className="w-full h-auto relative flex flex-col text-left gap-5">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p>{event.description}</p>

            <label className="flex items-center gap-1">
              <img
                className="w-5 h-5"
                src="http://localhost:5000/uploads/images/calender.png"
              />
              {`${new Date(event.date).getDate()} ${
                months[new Date(event.date).getMonth()]
              } ${new Date(event.date).getFullYear()}`}
            </label>

            <label className="flex items-center gap-1">
              <img
                className="w-5 h-5"
                src="http://localhost:5000/uploads/images/location.png"
              />
              {event.eventLocation}
            </label>

            <label className="flex items-center gap-1">
              <img
                className="w-5 h-5"
                src="http://localhost:5000/uploads/images/category.png"
              />
              {event.eventType}
            </label>
          </div>
        </div>

        {chatShow ? (
          (event.participators.some((x) => x.userId === user._id) ||
            event.manager.userId === user._id ||
            event.moderators.some((x) => x.userId === user._id)) && (
            <Chat setChatShow={setChatShow} chat={event.chat} />
          )
        ) : (
          <button
            className="bg-gray-300 bottom-0 right-0 fixed p-2"
            onClick={() => setChatShow(true)}
          >
            Chat
          </button>
        )}

        {(user._id === event.manager.userId ||
          event.moderators.some((x) => x.userId === user._id)) && (
          <button className="add-participator" onClick={() => setShow(true)}>
            Add Participator +
          </button>
        )}

        <div className="manager-container">
          <img
            className="w-12 h-12 rounded-full"
            src={`http://localhost:5000/${
              managerPic?.length > 0 ? managerPic : "uploads/images/default.png"
            }`}
          />
          <label>{event.manager.userName}</label>
          <label className="w-12 relative flex justify-start text-xs text-slate-400">
            Manager
          </label>
        </div>
      </div>

      {event.manager.userId !== user._id
        ? event.participators.some((x) => x.userId === user._id) === false &&
          (pendingJoinReqs.find(
            (p) => p.from.senderId === user._id && p.extraInfo === event._id
          ) ? (
            <label className="w-[20vh] absolute right-[23vh] text-white text-sm font-bold bg-green-200 top-[15vh] p-2">
              Request sended
            </label>
          ) : (
            <button
              className="w-[20vh] absolute right-[23vh] text-white text-lg font-bold bg-purple-300 top-[15vh] p-2"
              onClick={() =>
                joinRequestHandler(
                  event._id,
                  user.userName,
                  event.manager.userId
                )
              }
            >
              Join
            </button>
          ))
        : null}

      <Participators
        unrole={unrole}
        addParticipatorHandler={addParticipatorHandler}
        kickParticipator={kickParticipator}
        event={event}
        setDialog={setDialog}
      />

      {(event.manager.userId === user._id ||
        event.participators.some((x) => x.userId === user._id) ||
        event.moderators.some((x) => x.userId === user._id)) && (
        <label
          onClick={() =>
            setDialog({
              isShow: true,
              title: `Do you want to leave from ${event.name}`,
              handler: () =>
                leaveEvent(
                  `${
                    user._id === event.manager.userId
                      ? `/${event._id}/manager-remove`
                      : `/${event._id}/personal-leave`
                  }`
                ),
            })
          }
          className="w-auto h-12 bg-red-500 text-white p-2 cursor-pointer absolute right-6 top-[15vh]"
        >
          <img
            className="w-6 h-6 relative top-1/2 translate-y-[-50%]"
            src="http://localhost:5000/uploads/images/leave.png"
          />
        </label>
      )}
    </div>
  );
};

export default Event;
