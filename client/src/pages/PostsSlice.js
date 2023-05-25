import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  error: "",
  loading: false,
};

export const fetchPosts = createAsyncThunk(
  "postsSlice/fetchPosts",
  async (accessToken) => {
    const response = await axios.get(
      `https://blog-app-api-production-651f.up.railway.app/posts`,
      {
        headers: {
          accessToken: accessToken,
        },
      }
    );
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      const { listOfPosts } = action.payload;
      const postArray = Object.values(listOfPosts);
      state.posts = postArray;
      state.loading = false;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export const { setPosts, setError, setLoading } = postsSlice.actions;

export const updatePostLike = (postId, accessToken) => async () => {
  const response = await axios.post(
    `https://blog-app-api-production-651f.up.railway.app/likes`,
    { PostId: postId },
    {
      headers: {
        accessToken: accessToken,
      },
    }
  );
  return response;
};

export default postsSlice.reducer;
