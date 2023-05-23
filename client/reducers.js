import { combineReducers } from "redux";
import registrationReducer from "./src/pages/RegistrationSlice";
import loginReducer from "./src/pages/LoginSlice";
import postDetailsReducer from "./src/pages/PostDetailsSlice";
import postsReducer from "./src/pages/PostsSlice";

const rootReducer = combineReducers({
  registration: registrationReducer,
  login: loginReducer,
  posts: postsReducer,
  postDetails: postDetailsReducer,
});

export default rootReducer;
