import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import axios from "axios";
import "./style.css";
import Header from "./Components/Header";
import Posts from "./pages/Posts";
import AddPost from "./pages/AddPost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ErrorPage from "./pages/ErrorPage";
import { accessToken } from "./helpers/utils";
import ErrorBoundary from "./helpers/ErrorBoundary";

export const ThemeContext = createContext(null);
export const AuthContext = createContext("");

const App = () => {
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
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Router>
            <div className="background" id={theme}>
              <Header
                theme={theme}
                toggleTheme={toggleTheme}
                authState={authState}
                setAuthState={setAuthState}
              />
              <Routes>
                <Route
                  exact
                  path="details/:id/edit"
                  element={<EditPost authState={authState} />}
                />
                <Route
                  exact
                  path="details/:id"
                  element={<PostDetails authState={authState} />}
                />
                <Route
                  exact
                  path="/post"
                  element={<AddPost authState={authState} />}
                />
                <Route exact path="/registration" element={<Registration />} />
                <Route
                  exact
                  path="/login"
                  element={
                    <Login authState={authState} setAuthState={setAuthState} />
                  }
                />
                <Route exact path="/error" element={<ErrorPage />} />
                <Route
                  exact
                  path="/"
                  element={<Posts authState={authState} />}
                />
              </Routes>
            </div>
          </Router>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default function AppErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
