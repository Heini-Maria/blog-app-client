import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { accessToken } from "../helpers/utils";
import { postSchema } from "../helpers/postValidation";
import { addPost } from "../pages/PostsSlice";

const AddPost = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const initialValues = {
    title: "",
    post: "",
  };

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    }
  }, []);

  const handleAddPost = async (obj) => {
    const isValid = await postSchema.isValid(obj);
    if (isValid) {
      await dispatch(addPost(obj, accessToken()));
      navigate("/");
    }
  };

  return (
    <div className="new-post-view">
      <h2>New Fact</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={postSchema}
        onSubmit={handleAddPost}
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

export default AddPost;
