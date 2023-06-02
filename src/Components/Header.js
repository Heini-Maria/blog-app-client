import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setAuthState, setTheme } from "../AppSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, authState } = useSelector((state) => state.app);

  const logout = () => {
    localStorage.removeItem("accessToken");
    dispatch(
      setAuthState({
        username: "",
        id: 0,
        status: false,
      })
    );
    navigate(0);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      dispatch(setTheme("dark"));
    } else {
      dispatch(setTheme("light"));
    }
  };

  return (
    <header className="header">
      <NavLink className="logo" to="/">
        <h1>Nerdy Facts</h1>
        <span>microblog</span>
      </NavLink>
      <div className="header-actions">
        <div className="switch-container">
          <p>switch to {theme === "light" ? "dark" : "light"} mode</p>
          <label className="switch">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <span className="slider"></span>
          </label>
        </div>
        {!authState.status ? (
          <NavLink className="button" to="/login">
            Login
          </NavLink>
        ) : (
          <>
            <NavLink onClick={logout} className="button" to="/">
              Logout
            </NavLink>
            <NavLink className="button" to="post">
              Add a fact
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
