import React from "react";
import { useDispatch } from "react-redux";
import Form from "../components/Form";
import { logIn, setReports } from "../store/auth-slice";
import "./styles/auth.css";

export const userInformationsHelper = async (json, dispatch) => {
  const eventRes = await fetch("http://localhost:5000/event/all-events", {
    headers: { Authorization: json.token },
  });
  const eventJson = await eventRes.json();
  if (eventJson.message) return alert(eventJson.message);

  const notifyres = await fetch("http://localhost:5000/user/notifications", {
    headers: { Authorization: json.token },
  });
  const njson = await notifyres.json();

  const friendRes = await fetch("http://localhost:5000/user/get-friends", {
    headers: { Authorization: json.token },
  });
  const fjson = await friendRes.json();

  const participatedRes = await fetch(
    `http://localhost:5000/event/participated/${json._id}`,
    { headers: { Authorization: json.token } }
  );
  const participatedJson = await participatedRes.json();

  const pendingFriendReqsRes = await fetch(
    "http://localhost:5000/user/get-pending-friend",
    {
      headers: { Authorization: json.token },
    }
  );
  const pendingFriendReqsJson = await pendingFriendReqsRes.json();

  const pendingJoinReqsRes = await fetch(
    "http://localhost:5000/event/get-pending-join-reqs",
    {
      headers: {
        Authorization: json.token,
      },
    }
  );
  const pendingJoinReqsJson = await pendingJoinReqsRes.json();
  dispatch(
    logIn({
      user: json,
      events: eventJson,
      notifications: njson,
      friends: fjson,
      participated: participatedJson,
      pendingFriends: pendingFriendReqsJson,
      pendingJoins: pendingJoinReqsJson,
    })
  );
  if (json.userType === "admin") {
    const reports = await fetch("http://localhost:5000/report", {
      headers: { Authorization: json.token },
    });
    const reportsJson = await reports.json();
    console.log("reports: ", reportsJson);
    dispatch(setReports(reportsJson));
  }
};

const Auth = () => {
  const dispatch = useDispatch();
  const logInHandler = async (credentials) => {
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (json.message) return alert(json.message);

    delete json.password;
    localStorage.setItem("user", JSON.stringify(json));

    userInformationsHelper(json, dispatch);
  };
  return (
    <div className="auth-container">
      <div className="w-1/4 text-5xl text-purple-500 font-bold">EventApp</div>
      <Form logIn={logInHandler} />
    </div>
  );
};

export default Auth;
