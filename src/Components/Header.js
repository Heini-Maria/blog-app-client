import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleTheme, theme, authState, setAuthState }) => {
  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    navigate("/");
    navigate(0);
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
