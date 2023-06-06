import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../helpers/userValidation";
import { registerUser } from "./RegistrationSlice";

const Registration = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.registration.loading);
  const error = useSelector((state) => state.registration.error);
  let navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((response) => {
      if (!response.payload.error) {
        navigate("/login");
      }
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
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <span className="error-msg">{error}</span>}
        </Form>
      </Formik>
    </div>
  );
};

export default Registration;
