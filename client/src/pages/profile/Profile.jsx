import "./profile.css";
import React, { useContext, useState, useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const params = useParams();
  const [picFile, setPicFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${params.username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [params.username]);

  useEffect(() => {
    console.log("here");
    uploadFile(); // setPicFile takes time so we are rerending the moment state is updated
  }, [picFile]);

  const uploadFile = async () => {
    const newPost = { userId: currentUser._id };
    if (picFile) {
      console.log(picFile);
      const data = new FormData();
      const fileName = Date.now() + picFile.name;
      data.append("name", fileName);
      console.log(fileName);
      data.append("file", picFile);
      newPost.profilePicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log("error with upload", err);
      }
      try {
        await axios.put("/users/" + currentUser._id, newPost);
        window.location.reload();
        dispatch({ type: "UPDATE_PROFILE_PICTURE", payload: fileName });
      } catch (err) {
        console.log("error with /users", err);
      }
    }
  };

  const addProfilePic = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(typeof e.target.files[0]);
    setPicFile(e.target.files[0]);
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="profileUserImg"
              />
              <div className="addPicture">
                <label htmlFor="dp" className="">
                  <AddCircleIcon htmlColor="" className="shareIcon" />
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="dp"
                    accept=".png,.jpg,.jpg"
                    onChange={(e) => {
                      console.log("submitted");
                      addProfilePic(e);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc} </span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={params.username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
