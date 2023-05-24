import React, { createContext, useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
  const [theme, setTheme] = useState("light");
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

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
          setAuthState({ ...authState, status: false });
        } else {
          const { username, id } = response.data;
          setAuthState({ username: username, id: id, status: true });
        }
      } catch (error) {
        console.log("Error occurred while checking authentication:", error);
      }
    };
    authCheck();
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
              <Route
                exact
                path="/post"
                element={<AddPost authState={authState} />}
              />
              <Route exact path="/registration" element={<Registration />} />
              <Route
                exact
                path="/login"
                element={<Login setAuthState={setAuthState} />}
              />
              <Route exact path="/error" element={<ErrorPage />} />
              <Route exact path="/" element={<Posts authState={authState} />} />
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
