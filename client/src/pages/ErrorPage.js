import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const ErrorPage = () => {
  let navigate = useNavigate();
  return (
    <div className="error">
      <h3>Woopsie! Something went wrong..</h3>
      <div>
        <FaArrowRight
          onClick={() => {
            navigate("/");
          }}
          className="icon-error icon"
        />
        <Link to="/">Return to homepage.</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
