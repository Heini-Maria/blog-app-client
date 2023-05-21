import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { accessToken } from "../helpers/utils";
import { fetchPost, editPost } from "./PostDetailsSlice";
import FormFields from "../Components/FormFields";

const EditPost = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.postDetails.post);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPost({ postId: id, accessToken: accessToken() }));
    }
  }, [dispatch, id, accessToken]);

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(editPost({ id, formData, accessToken: accessToken() }))
      .unwrap()
      .then(() => {
        navigate(`/details/${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  return (
    <div className="new-post-view">
      <h2>Edit Post</h2>
      <form action="" onSubmit={handleEdit}>
        <FormFields post={post} error={error} setError={setError} />
      </form>
    </div>
  );
};

export default EditPost;
