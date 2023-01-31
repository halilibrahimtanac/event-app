import React, { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateEvent,
  updateFriends,
  updateNotifies,
} from "../../store/auth-slice";

const notifications_types = {
  "event-invitation": (n) => {
    let notify = {
      url: `/event/${n.extraInfo}`,
      desc: `${n.from.senderName} invited you to an event`,
      interact: `/event/${n.extraInfo}/participators`,
      isOption: true,
    };
    return notify;
  },
  "join-request": (n) => {
    let notify = {
      url: `/event/${n.extraInfo}`,
      desc: `${n.from.senderName} wants to join your event`,
      interact: `/event/${n.extraInfo}/participators`,
      isOption: true,
    };
    return notify;
  },
  friend: (n) => {
    let notify = {
      url: `/user/${n.from.senderId}`,
      desc: `${n.from.senderName} wants to be friend with you`,
      interact: `/user/friend/${n.from.senderId}`,
      isOption: true,
    };

    return notify;
  },
  interact: (n) => {
    return n.extraInfo;
  },
};

const removeNotify = async (id, token, dispatch) => {
  let notifyRes = await fetch("http://localhost:5000/user/remove-notify", {
    method: "POST",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const notifyJson = await notifyRes.json();
  console.log("notfication removing result: ", notifyJson);

  dispatch(updateNotifies(id));
};

const NotifyList = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userName, _id, profilePic, token } = useSelector(
    (state) => state.auth.user
  );
  const notifies = props.notifications.map((n) => {
    let fn = notifications_types[n.notifyType];
    return {
      ...fn(n),
      isSeen: n.isSeen,
      type: n.notifyType,
      _id: n._id,
      senderId: n.from.senderId,
    };
  });

  const notifyHandler = async (type, id, interact, userId) => {
    switch (type) {
      case "event-invitation":
        let eventRes = await fetch(`http://localhost:5000${interact}`, {
          method: "POST",
          body: JSON.stringify({ userId: _id, userName, profilePic }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const eventJson = await eventRes.json();
        console.log("notify accept result: ", eventJson);
        dispatch(updateEvent(eventJson));

        removeNotify(id, token, dispatch);
        break;
      case "join-request":
        console.log(
          type,
          "notifyid: ",
          id,
          "interact url: ",
          interact,
          "sender user id: ",
          userId
        );
        const userRes = await fetch(`http://localhost:5000/user/uid/${userId}`);
        if (userRes.ok) {
          const { profilePic, userName } = await userRes.json();
          const eventRes = await fetch(`http://localhost:5000${interact}`, {
            method: "POST",
            body: JSON.stringify({ userId, userName, profilePic }),
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if (eventRes.ok) {
            const eventJson = await eventRes.json();
            dispatch(updateEvent(eventJson));
            removeNotify(id, token, dispatch);
          }
        }
        break;
      case "friend":
        let friendRes = await fetch(`http://localhost:5000${interact}`, {
          method: "POST",
          headers: {
            Authorization: token,
          },
        });
        const friendsJson = await friendRes.json();
        if (friendsJson.message) return alert(friendsJson.message);
        dispatch(updateFriends(friendsJson));

        removeNotify(id, token, dispatch);
        window.location.reload();
        break;
      case "reject":
        removeNotify(id, token, dispatch);
        break;
      default:
        break;
    }
  };
  return (
    <div ref={ref} className={props.className}>
      {notifies.map((n) => (
        <div
          className={`p-2 flex ${
            !n.isSeen ? "bg-slate-200" : null
          } hover:bg-slate-300 text-center`}
        >
          <label onClick={() => navigate(n.url)}>{n.desc}</label>
          {n.isOption && (
            <div className="w-auto flex divide-x-[1px]">
              <button
                className="w-12 p-2 bg-green-400 hover:bg-green-500 text-white"
                onClick={() =>
                  notifyHandler(n.type, n._id, n.interact, n.senderId)
                }
              >
                {n.type === "event-invitation" ? "Join" : "Accept"}
              </button>
              <button
                className="w-12 p-2 bg-red-400 hover:bg-red-500 text-white"
                onClick={() => notifyHandler("reject", n._id)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default NotifyList;
