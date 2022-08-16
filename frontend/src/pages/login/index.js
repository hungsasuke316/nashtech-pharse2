import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IconEyeClose from "../../components/icon/IconEyeClose";
import IconEyeOpen from "../../components/icon/IconEyeOpen";
import "./login.scss";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);

  const loginHandler = () => {
    if (username && password) {
      const payload = { username, password };

      Loading.hourglass("Sending...");

      axios({
        headers: {
          "content-type": "application/json",
        },
        url: "https://backend05.azurewebsites.net/api/auth/login",
        data: payload,
        method: "POST",
      })
        .then((res) => {
          // set local storage
          localStorage.clear();
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("status", res.data.status);
          localStorage.setItem("location", res.data.location);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("role", res.data.role.name);
          Loading.remove();
          toast.success("Login success!!!");

          navigate("/");
        })
        .catch((err) => {
          Loading.remove();
          toast.error("Username or Password Invalid");
          console.log(err);
        });
    } else {
      toast.warning("All fields are required");
    }
  };

  return (
    <div className="form">
      <div className="form__container">
        <div>
          <img
            src={process.env.PUBLIC_URL + "/assets/logo.jpg"}
            alt="logo"
            className="form__logo"
          />
        </div>
        <div className="form__input-wrapper">
          <input
            type="text"
            id="username"
            className="form__input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type={togglePassword ? "text" : "password"}
            id="password"
            className="form__input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!togglePassword ? (
            <IconEyeClose
              className="icon-eye-login"
              onClick={() => setTogglePassword(true)}
            ></IconEyeClose>
          ) : (
            <IconEyeOpen
              className="icon-eye-login"
              onClick={() => setTogglePassword(false)}
            ></IconEyeOpen>
          )}
        </div>

        <button
          type="submit"
          className="form__button"
          onClick={loginHandler}
          disabled={!(username && password)}
          id="btnLogin"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
