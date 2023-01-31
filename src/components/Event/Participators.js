import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./participators.css";

const Img = (props) => {
  const [p, setP] = useState();
  useEffect(() => {
    getProfilePic(props.id).then((d) => setP(d));
  }, []);
  const getProfilePic = async (id) => {
    const picRes = await fetch("http://localhost:5000/user/profile-pic/" + id);
    const picJson = await picRes.json();

    return picJson;
  };
  return (
    <img
      alt=""
      className="participator-logo rounded-full"
      src={`http://localhost:5000/${
        p?.length > 0 ? p : "uploads/images/default.png"
      }`}
    />
  );
};

const Participators = ({
  event,
  kickParticipator,
  addParticipatorHandler,
  unrole,
  setDialog,
}) => {
  const { _id } = useSelector((state) => state.auth.user);
  const [profilePics, setProfilePics] = useState([]);

  return (
    <div className="participators-container">
      <div className="border-b-[1px] p-1">Participators</div>
      {event.participators.map((p, i) => (
        <div className="single-participator">
          <div key={profilePics[i]} className="flex items-center gap-3">
            {<Img id={p.userId} />}

            <Link to={`/user/${p.userId}`}>
              <label>{p.userName}</label>
            </Link>
          </div>

          {(event.manager.userId === _id ||
            event.moderators.some((x) => x.userId === _id)) && (
            <button className="remove-btn">
              <img
                onClick={() =>
                  setDialog({
                    isShow: true,
                    title: `Do you want to kick ${p.userName}?`,
                    handler: () => kickParticipator(p, "participators"),
                  })
                }
                alt=""
                src="http://localhost:5000/uploads/images/minus.png"
              />
              <img
                alt=""
                onClick={() =>
                  setDialog({
                    isShow: true,
                    title: `Do you want to make ${p.userName} moderator?`,
                    handler: () => addParticipatorHandler(p, "newMod", "PATCH"),
                  })
                }
                src="http://localhost:5000/uploads/images/moderator-add.png"
              />
            </button>
          )}
        </div>
      ))}
      <div className="border-b-[1px] p-1">Moderators</div>
      {event.moderators.map((m) => (
        <div className="single-participator">
          <div className="flex items-center">
            <img
              alt=""
              className="participator-logo"
              src={`http://localhost:5000/${
                m.profilePic.length > 0
                  ? m.profilePic
                  : "uploads/images/default.png"
              }`}
            />

            <Link to={`/user/${m.userId}`}>
              <label>{m.userName}</label>
            </Link>
          </div>
          {(event.manager.userId === _id ||
            event.moderators.some((x) => x.userId === _id)) && (
            <div className="remove-btn">
              <img
                onClick={() => kickParticipator(m, "moderators")}
                alt=""
                src="http://localhost:5000/uploads/images/minus.png"
              />
              <img
                onClick={() => unrole(m)}
                alt=""
                src="http://localhost:5000/uploads/images/moderator.png"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Participators;
