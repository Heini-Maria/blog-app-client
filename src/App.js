import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./style.css";
import Header from "./Components/Header";
import Home from "./pages/Home";
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
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const getPosts = () => {
    axios
      .get(`https://blog-app-api-production-651f.up.railway.app/posts`, {
        headers: { accessToken: accessToken() },
      })
      .then((response) => {
        if (response.status !== 200) {
          alert("Something went wrong. Please try again!");
        }
        setPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
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

  useEffect(() => {
    getPosts();
    const interval = setInterval(() => {
      getPosts();
    }, 10000);
    return () => clearInterval(interval);
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
              theme={theme}
              toggleTheme={toggleTheme}
              authState={authState}
              setAuthState={setAuthState}
            />
            <Routes>
              <Route
                exact
                path="details/:id/edit"
                element={<EditPost authState={authState} posts={posts} />}
              />
              <Route
                exact
                path="details/:id"
                element={
                  <PostDetails
                    authState={authState}
                    posts={posts}
                    likedPosts={likedPosts}
                  />
                }
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
                element={
                  <Home
                    authState={authState}
                    posts={posts}
                    likedPosts={likedPosts}
                  />
                }
              />
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
