import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaRegStar, FaRegComment } from "react-icons/fa";
import { prettyDate, accessToken } from "../helpers/utils";
import { updatePostLike } from "../pages/PostDetailsSlice";
import { useDispatch, useSelector } from "react-redux";

const Post = ({ post, likes }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.app.authState);
  const location = useLocation();
  const isUserLiked = likes.find((like) => like.UserId === id);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.Likes.length);

  useEffect(() => {
    setIsLiked(isUserLiked || post.liked);
  }, [isUserLiked, post.liked, location]);

  const likeAPost = async (postId) => {
    try {
      await dispatch(updatePostLike(postId, accessToken()));
      setIsLiked((prevIsLiked) => !prevIsLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log(error);
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
