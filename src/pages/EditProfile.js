import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";
import "../components/form.css";
import { updateUser } from "../store/auth-slice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editedUser, setEditedUser] = useState(user);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_id", editedUser._id);
    formData.append("name", editedUser.name);
    formData.append("gender", editedUser.gender);
    formData.append("birthDate", editedUser.birthDate);
    formData.append("location", editedUser.location);
    formData.append("description", editedUser.description);
    if (typeof editedUser.profilePic !== "string") {
      formData.append("image", editedUser.profilePic);
    }
    const updateRes = await fetch("http://localhost:5000/user/update-user", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: user.token,
      },
    });
    const updatedJson = await updateRes.json();
    if (updatedJson.message) return alert(updatedJson.message);
    console.log("updated user: ", updatedJson);
    dispatch(updateUser(updatedJson));
    navigate("/profile");
  };
  return (
    <>
      <h1 className="w-1/4 text-3xl text-purple-500 font-bold mx-auto">
        Edit Profile
      </h1>
      <form
        className="w-[40%] h-auto relative flex flex-col justify-evenly items-center shadow-lg bg-white mx-auto gap-4 mt-7"
        onSubmit={submitHandler}
      >
        <Input
          value={editedUser.name}
          className="input"
          inputClass="text"
          title="Name"
          inputType="text"
          inputName="name"
          onChangeHandler={(e) =>
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
          }
        />

        <Input
          className="input"
          inputClass="text"
          title="Choose New Picture"
          inputType="file"
          inputName="profilePic"
          onChangeHandler={(e) =>
            setEditedUser({ ...editedUser, [e.target.name]: e.target.files[0] })
          }
        />

        <div className="input">
          <label className="text-gray-600">Gender</label>
          <select
            value={editedUser.gender}
            className="text"
            name="gender"
            onChange={(e) =>
              setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
            }
          >
            <option></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <Input
          value={editedUser.birthDate}
          className="input"
          inputClass="text"
          title="Birth Date"
          inputType="date"
          inputName="birthDate"
          onChangeHandler={(e) =>
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
          }
        />

        <Input
          value={editedUser.location}
          className="input"
          inputClass="text"
          title="Location"
          inputType="text"
          inputName="location"
          onChangeHandler={(e) =>
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
          }
        />

        <Input
          value={editedUser.description}
          className="input"
          inputClass="text"
          title="Description"
          inputType="text"
          inputName="description"
          onChangeHandler={(e) =>
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
          }
        />

        <button className="button" type="submit">
          Edit
        </button>
      </form>
    </>
  );
};

export default EditProfile;
