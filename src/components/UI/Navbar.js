import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../store/auth-slice";
import "./navbar.css";
import NotifyList from "./NotifyList";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogged, userNotifications, user } = useSelector(
    (state) => state.auth
  );
  const [username, setUsername] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);

  const searchHandler = async (value) => {
    setUsername(value);
    if (value === "") {
      setFoundUsers([]);
    }
    const response = await fetch("http://localhost:5000/user/" + value, {
      headers: {
        Authorization: user.token,
      },
    });

    let json = await response.json();
    json = json.filter((x) => x._id !== user._id);
    if (json.message) return alert("Error");
    setFoundUsers(json);
  };

  const onClickHandler = (f) => {
    setUsername("");
    navigate(`/user/${f?._id}`);
    setFoundUsers([]);
  };

  const logOutHandler = () => {
    dispatch(logOut());
    navigate("/");
  };
  return (
    <div className="navbar">
      <div
        onClick={() => navigate("/")}
        className="w-auto text-3xl text-purple-500 font-bold cursor-pointer"
      >
        EventApp
      </div>

      <div className="search-bar-container relative">
        <input
          placeholder="Username..."
          value={username}
          type="text"
          className="search-bar"
          onChange={(e) => searchHandler(e.target.value)}
        />
        <img
          className="search-bar-logo"
          src="http://localhost:5000/uploads/images/search.png"
        />
        <div className="w-full h-auto z-10 flex flex-col absolute bg-white top-8 left-0">
          {foundUsers.map((f) => (
            <div
              className="flex items-center p-2 justify-start gap-2 hover:bg-gray-300"
              onClick={() => onClickHandler(f)}
            >
              <img
                className="w-7 h-7 rounded-full"
                src={`http://localhost:5000/${
                  f?.profilePic.length > 0
                    ? f?.profilePic
                    : "uploads/images/default.png"
                }`}
              />
              <label>{f?.userName}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="w-auto flex gap-5">
        <div className="navbar_buttons">
          {isLogged && user.userType === "admin" ? (
            <button
              onClick={() => navigate("/report")}
              className="absolute bg-red-500 text-white text-xs p-1 left-[-10vh]"
            >
              Reports
            </button>
          ) : null}
          {isLogged && (
            <button className="notifications">
              <img
                className="w-6 h-6"
                src="http://localhost:5000/uploads/images/notify.png"
              />
              {userNotifications.length > 0 && (
                <div className="red_dot">{userNotifications.length}</div>
              )}
            </button>
          )}
          {isLogged && (
            <>
              <NotifyList
                notifications={userNotifications}
                className="notifications-menu"
              />
              <button onClick={() => navigate("/chat")}>
                <img
                  className="w-6 h-6"
                  src="http://localhost:5000/uploads/images/chat.png"
                />
              </button>
              <button onClick={() => navigate("/")}>
                <img
                  className="w-6 h-6"
                  src="http://localhost:5000/uploads/images/home.png"
                />
              </button>
            </>
          )}
        </div>

        {isLogged && (
          <div className="w-auto h-auto flex items-center gap-2 justify-between cursor-pointer">
            <div
              className="flex items-center"
              onClick={() => navigate("/profile")}
            >
              <img
                className="w-12 h-12 rounded-full"
                src={`http://localhost:5000/${
                  user.profilePic.length > 0
                    ? user.profilePic
                    : "uploads/images/default.png"
                }`}
              />

              <label>{user.userName}</label>
            </div>

            <button onClick={logOutHandler}>
              <img
                className="w-4 h-4"
                src="http://localhost:5000/uploads/images/logout.png"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
