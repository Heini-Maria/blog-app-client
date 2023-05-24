import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { accessToken } from "../helpers/utils";
import { fetchPost, editPost } from "../pages/PostDetailsSlice";
import { postSchema } from "../helpers/postValidation";
import FormFields from "./FormFields";

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

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {
      title: formData.get("title") ?? "",
      post: formData.get("postText") ?? "",
    };
    const isValid = await postSchema.isValid(obj);
    console.log(isValid);
    if (!isValid) {
      setError("post can only contain letters, numbers and - ! . , ? : or )");
      return;
    } else {
      dispatch(editPost({ id, obj, accessToken: accessToken() }))
        .unwrap()
        .then(() => {
          navigate(`/details/${id}`);
        });
    }
  };

  return (
    <div className="new-post-view">
      <h2>Edit Post</h2>
      <form action="" onSubmit={handleEdit} onChange={handleEdit}>
        <FormFields post={post} error={error} setError={setError} />
      </form>
    </div>
  );
};

export default EditPost;
