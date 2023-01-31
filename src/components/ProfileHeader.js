import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { chatHandler } from "../pages/Profile";

const ProfileHeader = ({
  user,
  setFriendsShow,
  isUser,
  addFriendHandler,
  id,
  isFriendPending,
  unfriend,
}) => {
  const navigate = useNavigate();
  const userFriends = useSelector((state) => state.auth?.userFriends);
  const loggedUser = useSelector((state) => state.auth?.user);
  return (
    <div>
      <div className="w-1/2 h-[25vh] mx-auto mt-4 border-slate-200 flex justify-between">
        <div className="w-[40%] h-auto relative flex items-center justify-center gap-3">
          <img
            className="w-36 h-36 border-2 rounded-full"
            src={`http://localhost:5000/${
              user.profilePic.length > 0
                ? user.profilePic
                : "uploads/images/default.png"
            }`}
          />

          <div className="w-[45%] h-16 relative flex flex-col justify-between text-left">
            <div className="flex flex-col ">
              <label className="font-bold text-2xl">{user.name}</label>
              <label>{user.userName}</label>
            </div>
            <label className="font-thin">{user.email}</label>
          </div>
        </div>

        <div className="w-[45%] h-auto relative text-center ml-auto flex items-center justify-between">
          {isUser && (
            <div
              className="flex flex-col"
              onClick={() => chatHandler(user._id, loggedUser, navigate)}
            >
              <label>Send Message</label>
            </div>
          )}

          {isUser &&
            (userFriends?.includes(id) ? (
              <div onClick={() => unfriend()} className="flex flex-col">
                <label>Unfriend</label>
              </div>
            ) : isFriendPending ? (
              <label>Pending</label>
            ) : (
              <div
                className="flex flex-col"
                onClick={() => addFriendHandler(user._id)}
              >
                <label>Add Friend</label>
              </div>
            ))}

          <div
            onClick={() => (!isUser ? setFriendsShow(true) : null)}
            className="flex flex-col"
          >
            <label className="text-2xl font-bold">
              {!isUser && userFriends.length}
            </label>
            <label>friends</label>
          </div>

          {!isUser && (
            <button onClick={() => navigate("/edit-profile")}>Settings</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
