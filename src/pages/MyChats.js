import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Input from "../components/UI/Input";
import "./styles/mychats.css";

const fetchUsers = async (token, id) => {
  let fetchedUsers = [];

  const chatResponse = await fetch("http://localhost:5000/chat/my-chats", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  let chatJson = await chatResponse.json();
  if (chatJson.message) alert(chatJson.message);
  chatJson = chatJson.map((c) => c[0]);

  let ids = chatJson.map((c) => c.users.find((x) => x !== id));

  const userResponse = await fetch("http://localhost:5000/user/get-by-uids", {
    method: "POST",
    body: JSON.stringify(ids),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userJson = await userResponse.json();
  if (userJson.message) alert(userJson.message);

  fetchedUsers = userJson;

  return [fetchedUsers, chatJson];
};

const MyChats = () => {
  const location = useLocation();
  const [clickedChat, setClickedChat] = useState();
  const [message, setMessage] = useState("");
  const [chattedUsers, setChattedUsers] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchUsers(user.token, user._id).then((res) => {
      setChattedUsers({ users: res[0], chats: res[1] });

      if (location.state?.uid) {
        setClickedChat(
          res[1].find((c) => c.users.some((x) => x === location.state.uid))
        );
      }
    });
  }, []);

  const sendMessageHandler = async (chat, message) => {
    console.log(
      "Clicked Chat: ",
      clickedChat,
      "\nParameter Chat: ",
      chat,
      "\nMessage: ",
      message
    );
    const res = await fetch(`http://localhost:5000/chat/${chat._id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        user: user._id,
        text: message,
        receipent: chat.users.find((x) => x !== user._id),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    });
    const js = await res.json();
    setChattedUsers({
      ...chattedUsers,
      chats: chattedUsers.chats.map((c) => {
        if (c._id === js._id) {
          return js;
        }
        return c;
      }),
    });
    setMessage("");
    console.log(js);
  };
  return (
    <div className="main-container">
      <div className="chat-box">
        <div className="users-side">
          {chattedUsers.users?.map((u) => (
            <button
              className={`w-full h-auto relative flex justify-between box-border px-2 ${
                clickedChat?.users.some((x) => x === u._id)
                  ? "bg-gray-200"
                  : null
              }`}
              onClick={() =>
                setClickedChat(
                  chattedUsers.chats.find((c) =>
                    c.users.some((x) => x === u._id)
                  )
                )
              }
            >
              {u.userName}
            </button>
          ))}
        </div>

        <div className="chat-side">
          {clickedChat ? (
            <>
              <div className="flex flex-col">
                {chattedUsers.chats.map((c) => {
                  if (
                    c.users.some(
                      (x) => x === clickedChat.users.find((x) => x !== user._id)
                    )
                  ) {
                    return c.messages.map((m) => (
                      <label
                        className={`text-msg ${
                          m.senderId === user._id ? "user" : "opposite"
                        }`}
                      >
                        {m?.message}
                      </label>
                    ));
                  }
                  return null;
                })}
              </div>
            </>
          ) : null}
          {clickedChat && (
            <div className="w-full h-auto relative flex justify-center gap-7 mt-auto">
              <Input
                className="w-1/2 h-auto"
                inputClass="border-2"
                inputType="text"
                inputName="msg"
                value={message}
                onChangeHandler={(e) => setMessage(e.target.value)}
              />
              <button
                className="border-2"
                onClick={() => sendMessageHandler(clickedChat, message)}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyChats;
