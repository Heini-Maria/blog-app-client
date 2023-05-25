import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setAuthState } from "../AppSlice";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./LoginSlice";
import { userSchema } from "../helpers/userValidation";

const Login = () => {
  const dispatch = useDispatch();
  const initialValues = {
    username: "",
    password: "",
  };
  const loading = useSelector((state) => state.login.loading);
  let navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await dispatch(loginUser(data));
      const { username, id } = response.payload;
      dispatch(
        setAuthState({
          username: username,
          id: id,
          status: true,
        })
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleLogin}
      >
        <Form className="form">
          <label htmlFor="username">Username:</label>
          <Field type="text" name="username" id="username" />
          <span className="error-msg">
            <ErrorMessage name="username" component="span" />
          </span>
          <label htmlFor="password">Password:</label>
          <Field type="password" name="password" id="password" />
          <span className="error-msg">
            <ErrorMessage name="password" component="span" />
          </span>
          <button type="submit">{loading ? "Logging in..." : "login"}</button>
        </Form>
      </Formik>
      <p>
        Don`t have a Nerdy account yet?{" "}
        <Link to="/registration">Register here.</Link>
      </p>
    </div>
  );
};

export default Login;
