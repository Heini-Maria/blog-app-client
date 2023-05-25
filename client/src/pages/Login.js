import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthState } from "../AppSlice";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./LoginSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.login.loading);
  let navigate = useNavigate();

  const handleLogin = async () => {
    const userData = { username: username, password: password };
    try {
      const response = await dispatch(loginUser(userData));
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
      <div className="form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={handleLogin} type="submit">
          {loading ? "Logging in..." : "login"}
        </button>
      </div>
      <p>
        Don`t have a Nerdy account yet?{" "}
        <Link to="/registration">Register here.</Link>
      </p>
    </div>
  );
};

export default Login;
