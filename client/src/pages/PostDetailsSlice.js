import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  post: {},
  comments: [],
  newComment: "",
  loading: false,
  error: "",
};

export const fetchPost = createAsyncThunk(
  "postDetails/fetchPost",
  async ({ postId, accessToken }) => {
    const response = await axios.get(
      `https://blog-app-api-production-651f.up.railway.app/posts/byId/${postId}`,
      {
        headers: {
          accessToken: accessToken,
        },
      }
    );
    return response.data;
  }
);

export const fetchComments = createAsyncThunk(
  "postDetails/fetchComments",
  async (postId) => {
    const response = await axios.get(
      `https://blog-app-api-production-651f.up.railway.app/comments/${postId}`
    );
    return response.data;
  }
);

export const editPost = createAsyncThunk(
  "postDetails/editPost",
  async ({ id, obj, accessToken }) => {
    const response = await axios.put(
      `https://blog-app-api-production-651f.up.railway.app/posts/${id}`,
      obj,
      {
        headers: { accessToken },
      }
    );
    return response.data;
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
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.error = "";
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(fetchPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.post = action.payload;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchPost.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
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
      const updatedComments = [
        ...getState().postDetails.comments,
        response.data,
      ];
      dispatch(setComments(updatedComments));
    } catch (error) {
      dispatch(setError(error.message));
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

export const addPost = (post, accessToken) => async (dispatch) => {
  try {
    await axios.post(
      `https://blog-app-api-production-651f.up.railway.app/posts`,
      post,
      {
        headers: { accessToken: accessToken },
      }
    );
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default postDetailsSlice.reducer;
