import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchPost,
  fetchComments,
  addComment,
  setNewComment,
  setError,
} from "./PostDetailsSlice";
import { deletePost } from "./PostsSlice";
import { FaRegComment, FaTrash, FaPen, FaRegStar } from "react-icons/fa";
import { accessToken, prettyDate } from "../helpers/utils";
import { commentSchema } from "../helpers/commentValidation";
import LoadingAnimation from "../helpers/LoadingAnimation";

const PostDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, comments, newComment, error, loading } = useSelector(
    (state) => state.postDetails
  );
  const { authState } = useSelector((state) => state.app);

  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      dispatch(fetchPost({ postId: id, accessToken: accessToken() }));
      dispatch(fetchComments(id));
    }
  }, [id]);

  if (loading) {
    return <LoadingAnimation />;
  }

  const handleDeletePost = async () => {
    await dispatch(deletePost(id, accessToken()));
    navigate("/");
  };

  const handleAddComment = async () => {
    try {
      const obj = {
        comment: newComment,
      };
      const isValid = await commentSchema.isValid(obj);
      if (!isValid) {
        dispatch(
          setError(
            "post can only contain letters, numbers and - ! . , ? : or )"
          )
        );
        return;
      }
      await dispatch(addComment(newComment, id, accessToken()));
      setNewComment("");
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
        {post?.Likes?.length}
      </div>
      <h3>{comments.length} comments:</h3>
      <ul>
        {comments.map((comment) => {
          return (
            <li className="comment" key={comment.id.toString()}>
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
