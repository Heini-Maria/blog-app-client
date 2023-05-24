import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchPosts } from "./PostsSlice";
import Post from "../Components/Post";
import { accessToken } from "../helpers/utils";
import { useSelector, useDispatch } from "react-redux";
import LoadingAnimation from "../helpers/LoadingAnimation";

const Posts = ({ authState }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPosts(accessToken()));
    }
  }, [dispatch, accessToken, location]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="home">
      {posts.map((post, key) => {
        return (
          <Post
            post={post}
            key={key}
            likes={post.Likes}
            authState={authState}
          />
        );
      })}
    </div>
  );
};

export default Posts;
