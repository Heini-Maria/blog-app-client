import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  likedPosts: [],
  error: "",
  loading: false,
};

export const fetchPosts = createAsyncThunk(
  "postsSlice/fetchPosts",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://blog-app-api-production-651f.up.railway.app/posts`,
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
export const updatePostLike = createAsyncThunk(
  "postsSlice/updatePostLike",
  async ({ postId, accessToken, isLiked }, { rejectWithValue }) => {
    try {
      await axios.post(
        `https://blog-app-api-production-651f.up.railway.app/likes`,
        { PostId: postId },
        {
          headers: {
            accessToken: accessToken,
          },
        }
      );
      return { postId, isLiked };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
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
    builder.addCase(updatePostLike.fulfilled, (state, action) => {
      const { postId, isLiked } = action.payload;

      if (isLiked) {
        state.likedPosts.push(postId);
      } else {
        state.likedPosts = state.likedPosts.filter((id) => id !== postId);
      }
    });
  },
});

export const { setPosts, setError, setLoading } = postsSlice.actions;

export default postsSlice.reducer;
