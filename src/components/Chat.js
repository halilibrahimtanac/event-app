import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateEvent } from "../store/auth-slice";
import "./chat.css";
import Input from "./UI/Input";

const Chat = (props) => {
  const id = useParams().id;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState({
    senderId: user._id,
    senderUserName: user.name,
    message: "",
  });

  const sendMessage = async () => {
    const response = await fetch(`http://localhost:5000/event/${id}/chat`, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });

    const json = await response.json();
    if (json.error) return alert(json.error);
    dispatch(updateEvent(json));
  };
  return (
    <div className="chat-container">
      <button
        className="w-8 h-8 absolute top-0 left-[-32px] text-3xl bg-gray-300"
        onClick={() => props.setChatShow(false)}
      >
        -
      </button>
      <div className="messages">
        {props.chat.map((c) => (
          <div
            className={
              "single-message " + (c.senderId === user._id ? "my" : null)
            }
          >
            <label className="font-bold">{c.senderUserName}</label>
            <p className="message-body">{c.message}</p>
          </div>
        ))}
      </div>

      <div className="input-container">
        <Input
          className="w-4/5"
          inputType="text"
          inputName="message"
          inputClass="message-input"
          onChangeHandler={(e) =>
            setMessage({ ...message, message: e.target.value })
          }
        />
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
