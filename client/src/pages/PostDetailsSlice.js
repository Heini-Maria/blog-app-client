import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  comments: [],
  newComment: "",
  error: "",
};

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
