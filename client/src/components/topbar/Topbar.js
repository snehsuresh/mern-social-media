import React, { useContext } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from "../../apiCalls";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch } = useContext(AuthContext);
  const history = useNavigate();
  // console.log(user);
  const handleSignout = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    history("/login");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Handbook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for your friends, posts or videos"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <div className="topbarLinks">
          <span className="topbarLink">
            {" "}
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Timeline
            </Link>
          </span>

          <div className="topbarLink" onClick={handleSignout}>
            Sign Out
          </div>
        </div>

        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
