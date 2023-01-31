import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfileContent from "../components/ProfileContent";
import ProfileHeader from "../components/ProfileHeader";
import Modal from "../components/UI/Modal";
import "./styles/profile.css";

export const chatHandler = async (id, user, navigate) => {
  console.log("clicked id: ", id);
  const response = await fetch("http://localhost:5000/chat/new-chat", {
    method: "POST",
    body: JSON.stringify([id, user._id]),
    headers: {
      "Content-Type": "application/json",
      Authorization: user.token,
    },
  });

  const js = await response.json();
  console.log("Status: ", response.status, "\n", "Data: ", js);
  navigate("/chat", { state: { uid: id } });
};

const Profile = () => {
  const [show, setShow] = useState(false);
  const [friendsShow, setFriendsShow] = useState(false);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const { user, participatedEvents, userFriends } = useSelector(
    (state) => state.auth
  );
  const events = useSelector((state) =>
    state.auth.userEvents.filter((x) => x.manager.userId === user._id)
  );

  useEffect(() => {
    fetch("http://localhost:5000/user/all-users")
      .then((res) => res.json())
      .then((json) => {
        if (json.message) alert(json.message);
        json = json.filter((x) => x._id !== user._id);
        setAllUsers(json);
      });
  }, []);

  return (
    <>
      {show && (
        <Modal className="box" overlay="overlay" setShow={setShow}>
          <ul className="w-1/2 border-[1px] divide-y-[1px]">
            {allUsers.map((u) => (
              <li className="w-full p-2 flex justify-between">
                <Link to={`/user/${u._id}`}>{u.userName}</Link>{" "}
                <button onClick={() => chatHandler(u._id, user, navigate)}>
                  Chat {">"}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {friendsShow && (
        <Modal className="box" overlay="overlay" setShow={setFriendsShow}>
          <ul className="w-1/2 border-[1px] divide-y-[1px]">
            {userFriends.map((f) => (
              <li className="w-full p-2 flex justify-between">
                <img
                  className="w-5 h-5"
                  src={`http://localhost:5000/${
                    allUsers.find((x) => x._id === f).profilePic.length > 0
                      ? allUsers.find((x) => x._id === f).profilePic
                      : "uploads/images/default.png"
                  }`}
                />
                <Link to={`/user/${f}`}>
                  {allUsers.find((x) => x._id === f).userName}
                </Link>
              </li>
            ))}
          </ul>
        </Modal>
      )}
      <ProfileHeader
        user={user}
        setShow={setShow}
        setFriendsShow={setFriendsShow}
      />

      <h1 className="w-1/2 text-left mx-auto text-xs text-slate-500">
        {user.description}
      </h1>

      <ProfileContent events={events} participatedEvents={participatedEvents} />
    </>
  );
};

export default Profile;
