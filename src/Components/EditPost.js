import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { accessToken } from "../helpers/utils";
import { fetchPost, editPost } from "../pages/PostDetailsSlice";
import { postSchema } from "../helpers/postValidation";
import { Formik, Form, Field, ErrorMessage } from "formik";

const EditPost = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.postDetails.post);
  const initialValues = {
    title: post?.title || "",
    post: post?.post || "",
  };

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPost({ postId: id, accessToken: accessToken() }));
    }
  }, [dispatch, id, accessToken]);

  const handleEdit = async (obj) => {
    const isValid = await postSchema.isValid(obj);
    if (isValid) {
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
      <Formik
        initialValues={initialValues}
        validationSchema={postSchema}
        enableReinitialize={true}
        onSubmit={handleEdit}
      >
        <Form className="form">
          <label htmlFor="title">*Title: </label>
          <Field autoComplete="off" id="title" name="title" />
          <span className="error-msg">
            <ErrorMessage name="title" component="span" />
          </span>
          <label htmlFor="post">*Text: </label>
          <Field
            autoComplete="off"
            id="post"
            name="post"
            type="text"
            as="textarea"
          />
          <span className="error-msg">
            <ErrorMessage name="post" component="span" />
          </span>
          <p>* required</p>
          <div>
            <Link className="button cancel" to="/">
              Cancel
            </Link>
            <button className="button" type="submit">
              Save
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EditPost;
