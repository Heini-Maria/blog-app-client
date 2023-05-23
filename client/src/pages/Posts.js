import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchPosts } from "./PostsSlice";
import Post from "../Components/Post";
import { accessToken } from "../helpers/utils";
import { useSelector, useDispatch } from "react-redux";

const Posts = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, error, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPosts(accessToken()));
    }
  }, [dispatch, accessToken, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home">
      {posts.map((post, key) => {
        return (
          <Post
            post={post}
            key={key}
          />
        );
      })}
    </div>
  );
};

export default Posts;
