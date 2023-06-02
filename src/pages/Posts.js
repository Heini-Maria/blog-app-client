import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "./PostsSlice";
import Post from "../Components/Post";
import { accessToken } from "../helpers/utils";
import { useSelector, useDispatch } from "react-redux";
import LoadingAnimation from "../helpers/LoadingAnimation";

const Posts = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPosts(accessToken()));
    }
  }, [dispatch, accessToken]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="home">
      {posts.map((post, key) => {
        return <Post post={post} key={key} likes={post.Likes} />;
      })}
    </div>
  );
};

export default Posts;
