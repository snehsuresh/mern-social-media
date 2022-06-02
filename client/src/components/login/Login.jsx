import React, { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const location = useLocation();
  const newUser = location.state?.registered;

  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <>
      {newUser && (
        <div className="welcome">You're registered. Please log in.</div>
      )}
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Handbook</h3>
            <span className="loginDesc">
              Connect with friends like they're only hands away with Handbook
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                placeholder="Email"
                type="email"
                required
                className="loginInput"
                ref={email}
              />
              <input
                placeholder="Password"
                type="password"
                required
                className="loginInput"
                ref={password}
              />
              <button className="loginButton" disabled={isFetching}>
                {isFetching ? (
                  <CircularProgress color="info" size="20px" />
                ) : (
                  "Log In"
                )}
              </button>
              <span className="loginForgot">Forgot Password?</span>
              <button className="loginRegisterButton">
                {isFetching ? (
                  <CircularProgress color="info" size="20px" />
                ) : (
                  <Link to="/register" style={{ textDecoration: "none" }}>
                    Create New Account
                  </Link>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
