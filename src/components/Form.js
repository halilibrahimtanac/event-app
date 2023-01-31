import React, { useState } from "react";
import Input from "./UI/Input";
import "./form.css";
import { Link } from "react-router-dom";
import SignUpForm from "./UI/SignUpForm";

const Form = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState({});
  const [signup, setSignUp] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    if (isLogin) return props.logIn(login);
  };

  const signupHandler = async (e) => {
    console.log(signup);
    const formData = new FormData();
    let allkeys = Object.keys(signup);
    for (let i = 0; i < allkeys.length; i++) {
      formData.append(allkeys[i], signup[allkeys[i]]);
    }
    e.preventDefault();
    const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    if (json.message) return alert(json.message);

    alert("Successfully signed up");
  };
  return (
    <>
      {isLogin ? (
        <form className="form" onSubmit={submitHandler}>
          <Input
            className="input"
            inputClass="text"
            title="E-mail"
            inputType="text"
            inputName="email"
            onChangeHandler={(e) =>
              setLogin({ ...login, [e.target.name]: e.target.value })
            }
          />
          <Input
            className="input"
            inputClass="text"
            title="Password"
            inputType="password"
            inputName="password"
            onChangeHandler={(e) =>
              setLogin({ ...login, [e.target.name]: e.target.value })
            }
          />

          {Object.values(login).every((x) => x.length > 0) ? (
            <Input
              className="input"
              inputClass="button"
              inputType="submit"
              inputName="Log In"
              value="Sign In"
            />
          ) : (
            <input
              className="w-1/2 bg-purple-200 relative p-1 text-white font-bold"
              type="submit"
              disabled
              value="Sign In"
            />
          )}
        </form>
      ) : (
        <SignUpForm
          signupHandler={signupHandler}
          setSignUp={setSignUp}
          signup={signup}
        />
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Signup" : "Login"}
      </button>
    </>
  );
};

export default Form;
