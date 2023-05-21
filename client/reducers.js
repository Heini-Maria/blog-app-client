import { combineReducers } from "redux";
import registrationReducer from "./src/pages/RegistrationSlice";
import postDetailsReducer from "./src/pages/PostDetailsSlice";
import postsReducer from "./src/pages/PostsSlice";

const rootReducer = combineReducers({
  registration: registrationReducer,
  posts: postsReducer,
  postDetails: postDetailsReducer,
});

export default rootReducer;
