import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchComments,
  addComment,
  deletePost,
  setNewComment,
  setError,
} from "./PostDetailsSlice";
import { FaRegComment, FaTrash, FaPen, FaRegStar } from "react-icons/fa";
import { accessToken, prettyDate } from "../helpers/utils";
import { commentSchema } from "../helpers/commentValidation";

const PostDetails = ({ authState, posts }) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { comments, newComment, error } = useSelector(
    (state) => state.postDetails
  );

  const post = posts.find((post) => {
    return post.id == id;
  });
  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchComments(id));
    }
  }, [dispatch, id, handleAddComment]);

  const handleDeletePost = () => {
    console.log(id, accessToken());
    dispatch(deletePost(id, accessToken()));
    navigate("/");
  };

  const handleAddComment = async () => {
    try {
      const obj = {
        comment: newComment,
      };

      // Validate the comment using the commentSchema
      const isValid = await commentSchema.isValid(obj);

      if (!isValid) {
        dispatch(setError("Comment is not valid")); // Set the error message in the Redux state
        return;
      }

      // Add the comment if it is valid

      await dispatch(addComment(newComment, id, accessToken()));
      setNewComment(""); // Clear the local state value
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeComment = (e) => {
    dispatch(setNewComment(e.target.value));
    dispatch(setError(null));
  };

  return (
    <div className="details">
      {authState.username === post.username && (
        <div className="settings">
          <Link to={`/details/${id}/edit`}>
            <FaPen className="icon" />
          </Link>
          <FaTrash className="icon" onClick={handleDeletePost} />
        </div>
      )}
      <p>posted by @{post.username}</p>
      <h2>{post.title}</h2>
      <span>{prettyDate(post.createdAt)}</span>
      <p>{post.post}</p>
      <div className="likes">
        <FaRegStar />
        {post.Likes.length}
      </div>
      <h3>{comments.length} comments:</h3>
      <ul>
        {comments.map((comment, index) => {
          return (
            <li className="comment" key={index}>
              <strong>@{comment.username}: </strong>
              {comment.comment}
            </li>
          );
        })}
      </ul>
      <div className="leave-comment">
        <input
          type="text"
          maxLength={45}
          minLength={3}
          onChange={handleChangeComment}
          id="comment"
          name="comment"
          value={newComment}
          placeholder="add comment.."
          required
        />
        <FaRegComment
          onClick={handleAddComment}
          type="submit"
          className="icon"
        />
      </div>
      <span className="error-msg">{error}</span>
      <Link to="/" className="button cancel">
        Back
      </Link>
    </div>
  );
};

export default PostDetails;
