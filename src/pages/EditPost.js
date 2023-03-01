import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postSchema } from "../helpers/postValidation";
import { accessToken } from "../helpers/utils";
import axios from "axios";
import FormFields from "../Components/FormFields";

const EditPost = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:3001/posts/byId/${id}`, {
          headers: { accessToken: accessToken() },
        })
        .then((response) => {
          setPost(response.data);
        });
    }
  }, []);
  const editPost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {
      title: formData.get("title") ?? "",
      post: formData.get("postText") ?? "",
    };
    const isValid = await postSchema.isValid(obj);
    if (!isValid) {
      setError("post can only contain letters, numbers and - ! ? : or )");
    } else {
      axios
        .put(`http://localhost:3001/posts/${id}`, obj, {
          headers: { accessToken: accessToken() },
        })
        .then((response) => {
          if (response.data.error) {
            navigate("/error");
          } else {
            navigate(`/details/${id}`);
          }
        });
      setError("");
    }
  };
  return (
    <div className="new-post-view">
      <h2>Edit Post</h2>
      <form action="" onSubmit={editPost}>
        <FormFields post={post} error={error} setError={setError}/>
      </form>
    </div>
  );
};

export default EditPost;
