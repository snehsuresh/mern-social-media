import axios from "axios";
import React, { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom"; //redirect user to previous page
import { Link } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const password = useRef();
  const email = useRef();
  const passwordagain = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordagain.current.value !== password.current.value) {
      passwordagain.current.setCustomValidity("Passwords don't match, Oops!");
    } else {
      const user = {
        username: username.current.value,
        password: password.current.value,
        email: email.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login", {
          state: {
            registered: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Handbook</h3>
          <span className="loginDesc">
            Connect with friends like they're only a hand away with Handbook
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              className="loginInput"
              required
              ref={username}
            />
            <input
              placeholder="Email"
              className="loginInput"
              required
              ref={email}
              type="email"
            />
            <input
              placeholder="Password"
              className="loginInput"
              required
              ref={password}
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              className="loginInput"
              required
              ref={passwordagain}
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="/login">
              <button className="loginRegisterButton">
                Log in to your account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
