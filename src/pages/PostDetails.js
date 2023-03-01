import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegComment, FaTrash, FaPen, FaRegStar } from "react-icons/fa";
import { accessToken, prettyDate } from "../helpers/utils";
import { commentSchema } from "../helpers/commentValidation";

const PostDetails = ({ authState, posts }) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState();
  const [error, setError] = useState("");

  const post = posts.find((post) => {
    return post.id == id;
  });
  useEffect(() => {
    if (!accessToken()) {
      navigate("/login");
    } else {
      try {
        axios
          .get(
            `https://blog-app-api-production-651f.up.railway.app/comments/${id}`
          )
          .then((response) => {
            setComments(response.data);
          });
      } catch (error) {
        navigate("/error");
      }
    }
  }, []);

  const deletePost = (id) => {
    axios
      .delete(
        `https://blog-app-api-production-651f.up.railway.app/posts/${id}`,
        {
          headers: { accessToken: accessToken() },
        }
      )
      .then(() => {
        navigate("/");
      });
  };

  const addComment = async (e) => {
    e.preventDefault();

    const obj = {
      comment: newComment,
    };
    const isValid = await commentSchema.isValid(obj);
    if (!isValid) {
      setError("post can only contain letters, numbers and - ! . , ? : or )");
    }else{
      axios
        .post(
          `https://blog-app-api-production-651f.up.railway.app/comments`,
          {
            comment: newComment,
            PostId: id,
          },
          {
            headers: {
              accessToken: accessToken(),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            navigate("/error");
          } else {
            const commentToAdd = {
              comment: newComment,
              username: response.data.username,
            };
            setComments([...comments, commentToAdd]);
            setNewComment("");
            setError("");
          }
        });
    }
  };

  return (
    <div className="details">
      {authState.username === post.username && (
        <div className="settings">
          <Link to={`/details/${id}/edit`}>
            <FaPen className="icon" />
          </Link>
          <FaTrash className="icon" onClick={() => deletePost(id)} />
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
          onChange={(e) => {
            setNewComment(e.target.value);
            setError("");
          }}
          id="comment"
          name="comment"
          value={newComment}
          placeholder="add comment.."
          required
        />
        <FaRegComment onClick={addComment} type="submit" className="icon" />
      </div>
      <span className="error-msg">{error}</span>
      <Link to="/" className="button cancel">
        Back
      </Link>
    </div>
  );
};

export default PostDetails;
