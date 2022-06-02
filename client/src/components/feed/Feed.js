import React, { useState, useEffect, useContext } from "react";
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPost = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          //sorting timeline posts data
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPost();
  }, [username, user._id, refresh]); //empty array means run only once
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => {
          return <Post key={p._id} post={p} refreshPost={setRefresh} />;
        })}
      </div>
    </div>
  );
}
