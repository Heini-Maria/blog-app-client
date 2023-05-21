import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { postSchema } from "../helpers/postValidation";

const initialState = {
  post: {},
  comments: [],
  newComment: "",
  error: "",
};

export const fetchPost = createAsyncThunk(
  "postDetails/fetchPost",
  async ({ postId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://blog-app-api-production-651f.up.railway.app/posts/byId/${postId}`,
        {
          headers: {
            accessToken: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "postDetails/editPost",
  async ({ id, formData, accessToken }, { rejectWithValue }) => {
    try {
      const obj = {
        title: formData.get("title") ?? "",
        post: formData.get("postText") ?? "",
      };
      const isValid = await postSchema.isValid(obj);
      if (!isValid) {
        throw new Error(
          "Post can only contain letters, numbers, and special characters"
        );
      } else {
        const response = await axios.put(
          `https://blog-app-api-production-651f.up.railway.app/posts/${id}`,
          obj,
          {
            headers: { accessToken },
          }
        );
        if (response.data.error) {
          throw new Error("An error occurred while updating the post");
        } else {
          return response.data;
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postDetailsSlice = createSlice({
  name: "postDetails",
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setNewComment: (state, action) => {
      state.newComment = action.payload;
      state.error = "";
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.post = action.payload;
    });
    builder.addCase(fetchPost.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(editPost.fulfilled, (state, action) => {
      state.post = action.payload;
      state.error = "";
    });
    builder.addCase(editPost.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { setComments, setNewComment, setError } =
  postDetailsSlice.actions;

export const fetchComments = createAsyncThunk(
  "postDetails/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://blog-app-api-production-651f.up.railway.app/comments/${postId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment =
  (comment, postId, accessToken) => async (dispatch, getState) => {
    try {
      const response = await axios.post(
        `https://blog-app-api-production-651f.up.railway.app/comments`,
        {
          comment,
          PostId: postId,
        },
        {
          headers: {
            accessToken: accessToken,
          },
        }
      );
      dispatch(setNewComment(""));
      dispatch(setError(null));
      const updatedComments = [
        ...getState().postDetails.comments,
        response.data,
      ];
      dispatch(setComments(updatedComments));
    } catch (error) {
      console.log(error);
    }
  };

export const deletePost = (id, accessToken) => async (dispatch) => {
  try {
    await axios.delete(
      `https://blog-app-api-production-651f.up.railway.app/posts/${id}`,
      {
        headers: { accessToken: accessToken },
      }
    );
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default postDetailsSlice.reducer;
