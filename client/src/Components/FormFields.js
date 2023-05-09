import React from "react";
import { Link } from "react-router-dom";

const FormFields = ({ post, error, setError }) => {
  return (
    <div className="form">
      <label htmlFor="title">*Title:</label>
      <input
        type="text"
        name="title"
        id="title"
        minLength={3}
        maxLength={60}
        defaultValue={post.title}
        required
      />
      <span className="error-msg"></span>
      <label htmlFor="postText">*Text:</label>
      <textarea
        name="postText"
        id="postText"
        cols="10"
        rows="3"
        minLength={10}
        maxLength={300}
        defaultValue={post.post}
        onChange={() => {
          setError("");
        }}
        required
      ></textarea>
      <span className="error-msg">{error}</span>
      <p>* required</p>
      <div>
        <Link className="button cancel" to="/">
          Cancel
        </Link>
        <button className="button" type="submit">
          Save
        </button>
      </div>
    </div>
  );
};

export default FormFields;
