import React from "react";
import Input from "./Input";

const SignUpForm = ({ setSignUp, signupHandler, signup }) => {
  return (
    <form className="signup" onSubmit={signupHandler}>
      <Input
        className="input"
        inputClass="text"
        title="Name"
        inputType="text"
        inputName="name"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="User Name"
        inputType="text"
        inputName="userName"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="E-mail"
        inputType="text"
        inputName="email"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="Password"
        inputType="password"
        inputName="signUpPassword"
        value={signup.password ? signup.password : ""}
        onChangeHandler={(e) =>
          setSignUp({ ...signup, password: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="Profile Pic"
        inputType="file"
        inputName="image"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.files[0] })
        }
      />
      <div className="input">
        <label className="text-gray-600">Gender</label>
        <select
          className="text"
          name="gender"
          onChange={(e) =>
            setSignUp({ ...signup, [e.target.name]: e.target.value })
          }
        >
          <option></option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <Input
        className="input"
        inputClass="text"
        title="Birth Date"
        inputType="date"
        inputName="birthDate"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="Location"
        inputType="text"
        inputName="location"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />
      <Input
        className="input"
        inputClass="text"
        title="Description"
        inputType="text"
        inputName="description"
        onChangeHandler={(e) =>
          setSignUp({ ...signup, [e.target.name]: e.target.value })
        }
      />

      {Object.values(signup).every((x) =>
        typeof x === "string" ? x !== "" : x
      ) ? (
        <Input
          className="input"
          inputClass="button"
          inputType="submit"
          inputName="SignUp"
          value="Sign Up"
        />
      ) : (
        <input
          className="w-1/2 bg-purple-200 relative p-1 text-white font-bold"
          type="submit"
          disabled
          value="Sign Up"
        />
      )}
    </form>
  );
};

export default SignUpForm;
