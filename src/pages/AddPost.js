import React, { useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { accessToken } from "../helpers/utils";
import { postSchema } from "../helpers/postValidation";

const AddPost = () => {
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

  const addPost = (obj) => {
    axios
      .post(`https://blog-app-api-production-651f.up.railway.app/posts`, obj, {
        headers: { accessToken: accessToken() },
      })
      .then((response) => {
        if (response.data.error) {
          navigate("/error");
        } else {
          navigate("/");
          navigate(0);
        }
      });
  };

  return (
    <div className="new-post-view">
      <h2>New Fact</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={postSchema}
        onSubmit={addPost}
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
