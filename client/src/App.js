import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./style.css";
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

export const ThemeContext = createContext(null);
export const AuthContext = createContext("");

const App = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("light");
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("https://blog-app-api-production-651f.up.railway.app/auth/auth", {
        headers: {
          accessToken: accessToken(),
        },
      })
      .then((response) => {
        if (response.data.error) {
          dispatch(setAuthState({ ...authState, status: false }));
        } else {
          dispatch(
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              status: true,
            })
          );
        }
      });
  }, []);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Router>
          <div className="background" id={theme}>
            <Header
              authState={authState}
              setAuthState={setAuthState}
              theme={theme}
              setTheme={setTheme}
              toggleTheme={toggleTheme}
            />
            <Routes>
              <Route exact path="details/:id/edit" element={<EditPost />} />
              <Route
                exact
                path="details/:id"
                element={<PostDetails authState={authState} />}
              />
              <Route exact path="/post" element={<AddPost />} />
              <Route exact path="/registration" element={<Registration />} />
              <Route
                exact
                path="/login"
                element={<Login setAuthState={setAuthState} />}
              />
              <Route exact path="/error" element={<ErrorPage />} />
              <Route exact path="/" element={<Posts />} />
            </Routes>
          </div>
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

export default function AppErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
