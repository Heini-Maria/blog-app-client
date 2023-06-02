import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import { setAuthState } from "./AppSlice";
import axios from "axios";
import Header from "./Components/Header";
import Posts from "./pages/Posts";
import AddPost from "./Components/AddPost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./Components/EditPost";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ErrorPage from "./pages/ErrorPage";
import { accessToken } from "./helpers/utils";
import ErrorBoundary from "./helpers/ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const { authState, theme } = useSelector((state) => state.app);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const response = await axios.get(
          "https://blog-app-api-production-651f.up.railway.app/auth/auth",
          {
            headers: {
              accessToken: accessToken(),
            },
          }
        );
        if (response.data.error) {
          dispatch(setAuthState({ ...authState, status: false }));
        } else {
          const { username, id } = response.data;
          dispatch(setAuthState({ username: username, id: id, status: true }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    authCheck();
  }, []);

  return (
    <Router>
      <div className="background" id={theme}>
        <Header />
        <Routes>
          <Route exact path="details/:id/edit" element={<EditPost />} />
          <Route exact path="details/:id" element={<PostDetails />} />
          <Route exact path="/post" element={<AddPost />} />
          <Route exact path="/registration" element={<Registration />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/error" element={<ErrorPage />} />
          <Route exact path="/" element={<Posts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default function AppErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
