import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProfileContent from "../components/ProfileContent";
import ProfileHeader from "../components/ProfileHeader";
import Modal from "../components/UI/Modal";
import {
  addReport,
  removeFriend,
  updateFriendPendingReqs,
} from "../store/auth-slice";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uid = useParams().uid;
  const _id = useSelector((state) => state.auth.user?._id);
  const userName = useSelector((state) => state.auth.user?.userName);
  const token = useSelector((state) => state.auth.user?.token);
  const pendingFriendReqs = useSelector(
    (state) => state.auth.pendingFriendReqs
  );
  const [fetchedUser, setFetchedUser] = useState();
  const [fetchedUserEvents, setFetchedUserEvents] = useState();
  const [participatedEvents, setParticipatedEvents] = useState();
  const [report, setReport] = useState({
    isShow: false,
    input: "",
  });

  if (uid === _id) {
    navigate("/profile");
  }

  const reportHandler = async () => {
    const reportRes = await fetch("http://localhost:5000/report", {
      method: "POST",
      body: JSON.stringify({
        reportType: "user-report",
        reporter: _id,
        reported: uid,
        reportDesc: report.input,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const reportJs = await reportRes.json();
    dispatch(addReport(reportJs));
    setReport({ isShow: false, input: "" });
    alert("User reported");
  };

  const unfriend = async () => {
    const unfriendRes = await fetch("http://localhost:5000/user/unfriend", {
      method: "POST",
      body: JSON.stringify({ id: _id, friend: uid }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (unfriendRes.ok) {
      return dispatch(removeFriend(uid));
    }
    alert("failed");
  };

  const addFriendHandler = async (id) => {
    let url = "http://localhost:5000/user/add-friend-req";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        senderId: _id,
        senderName: userName,
        to: uid,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const j = await res.json();
    dispatch(updateFriendPendingReqs(j.to));
    alert(res.ok ? "success" : "failed");
  };

  useEffect(() => {
    const getUserAndEvents = async () => {
      const res = await fetch("http://localhost:5000/user/uid/" + uid);
      const rj = await res.json();
      if (rj.message) {
        navigate("/");
        return alert(rj.message);
      }
      setFetchedUser(rj);

      const eventRes = await fetch(
        `http://localhost:5000/event/${rj._id}/my-events`
      );
      const erj = await eventRes.json();
      if (erj.message) return alert(erj.message);
      setFetchedUserEvents(erj);

      const participated = await fetch(
        `http://localhost:5000/event/participated/${rj._id}`
      );
      const participatedJson = await participated.json();
      setParticipatedEvents(participatedJson);
    };

    getUserAndEvents();
  }, [uid]);
  return (
    <>
      {fetchedUser ? (
        <>
          {report.isShow && (
            <Modal
              className="w-1/3 h-[30vh] absolute bg-white z-10 left-1/3 top-[35vh] p-2 flex flex-col items-center"
              overlay="w-full h-screen absolute bg-black z-[5] opacity-50"
              setShow={(value) => setReport({ isShow: value, input: "" })}
            >
              <h1 className="relative top-[10vh] w-[70%] text-left">
                Report description:
              </h1>
              <input
                className="relative top-[10vh] border-[1px] p-3 w-[70%] text-sm"
                value={report.input}
                type="text"
                onChange={(e) =>
                  setReport({ ...report, input: e.target.value })
                }
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
          {fetchedUser?.userType !== "admin" && (
            <button
              onClick={() => setReport({ isShow: true, input: "" })}
              className="bg-red-500 absolute left-0 top-[10vh] text-xs text-white p-2"
            >
              Report this user
            </button>
          )}
          <ProfileHeader
            id={fetchedUser._id}
            user={fetchedUser}
            isUser={true}
            unfriend={unfriend}
            isFriendPending={pendingFriendReqs.includes(fetchedUser?._id)}
            addFriendHandler={addFriendHandler}
          />
          {fetchedUserEvents ? (
            <ProfileContent
              participatedEvents={participatedEvents}
              events={fetchedUserEvents}
            />
          ) : (
            <h1>Loading...</h1>
          )}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
};

export default User;
