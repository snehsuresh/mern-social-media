import React, { useState, useEffect, useContext, useRef } from "react";
import "./post.css";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
// import { format } from "timeago.js";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post, refreshPost }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const comRef = useRef();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  //check if post is already liked in db
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const addComment = async (e) => {
    // useForceUpdate();
    e.preventDefault();
    const newPost = {
      userId: currentUser._id,
      comment: {
        pic: currentUser.profilePicture,
        name: currentUser.username,
        content: comRef.current.value,
      },
    };
    try {
      await axios.put("/posts/" + post._id + "/comment", newPost);
      refreshPost((v) => v + 1);
    } catch (error) {}
    comRef.current.value = "";
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      await axios.delete("/posts/" + post._id, {
        data: {
          userId: currentUser._id,
        },
      });
      refreshPost((v) => v + 1);
    } catch (error) {
      console.log("You cannot delete this post");
    }
  };

  // const user = Users.filter((u) => u.id === 1);
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>

            <span className="postUsername">{user.username}</span>
            <span className="postDate">
              {<ReactTimeAgo date={Date.parse(post.createdAt)} />}
            </span>
          </div>
          <div className="dropdown postTopRight">
            <MoreVert className="" />
            <div className="dropdown-content">
              <span onClick={deletePost}>Delete</span>
            </div>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              alt=""
              onClick={likeHandler}
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              alt=""
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{like} people like this</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post.comments.length} comments
            </span>
          </div>
        </div>
        <form className="comment" onSubmit={addComment}>
          <textarea name="" id="comment" ref={comRef}></textarea>
          <button type="submit" className="commentButton">
            Comment
          </button>
        </form>
        {post.comments.length > 0 && (
          <>
            <div className="commentLabel">Comments</div>
          </>
        )}
        <hr />
        <div className="commentsContainer">
          {post.comments.map((c) => {
            const comment = c.comment;

            return (
              <>
                <div className="commentSection">
                  <img
                    src={
                      comment.pic
                        ? PF + comment.pic
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="commentImg"
                  />
                  <div className="commenter">{comment.name}:</div>
                  <p className="singleComment">{comment.content}</p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
