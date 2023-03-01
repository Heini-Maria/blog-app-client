import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userSchema } from "../helpers/userValidation";

const Registration = () => {
  let navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      }
      navigate("/login");
    });
  };
  return (
    <div className="register">
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={onSubmit}
      >
        <Form className="form">
          <label htmlFor="username">*Username: </label>
          <Field autoComplete="off" id="username" name="username" />
          <span className="error-msg">
            <ErrorMessage name="username" component="span" />
          </span>
          <label htmlFor="password">*Password: </label>
          <Field
            autoComplete="off"
            id="password"
            name="password"
            type="password"
          />
          <span className="error-msg">
            <ErrorMessage name="password" component="span" />
          </span>
          <p>* required</p>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Registration;
