import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaRegComment } from "react-icons/fa";
import { prettyDate, accessToken } from "../helpers/utils";
import { updatePostLike } from "../pages/PostsSlice";
import { useDispatch } from "react-redux";

const Post = ({ post }) => {
  let navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.Likes.length);
  const dispatch = useDispatch();

  const likeAPost = async (postId) => {
    try {
      await dispatch(updatePostLike({ postId, accessToken: accessToken() }));
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log("Error occurred while updating post like:", error);
    }
  };

  return (
    <div className="post">
      <p>@{post.username}</p>
      <h3>{post.title}</h3>
      <span>{prettyDate(post.createdAt)}</span>
      <p>{post.post}</p>
      <div className="stats">
        <div className="stats-icons">
          {isLiked ? (
            <p>
              <FaStar className="liked" onClick={() => likeAPost(post.id)} />
              {likesCount}
            </p>
          ) : (
            <p>
              <FaRegStar
                className="unliked"
                onClick={() => likeAPost(post.id)}
              />
              {likesCount}
            </p>
          )}
          <p>
            <FaRegComment
              onClick={() => {
                navigate(`details/${post.id}`);
              }}
              className="post-comments"
            />
            {post.Comments.length}
          </p>
        </div>
        <Link to={`/details/${post.id}`} className="button">
          View
        </Link>
      </div>
    </div>
  );
};

export default Post;
