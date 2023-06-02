import { combineReducers } from "redux";
import registrationReducer from "./src/pages/RegistrationSlice";
import loginReducer from "./src/pages/LoginSlice";
import postDetailsReducer from "./src/pages/PostDetailsSlice";
import postsReducer from "./src/pages/PostsSlice";
import appReducer from "./src/AppSlice";

const rootReducer = combineReducers({
  app: appReducer,
  registration: registrationReducer,
  login: loginReducer,
  posts: postsReducer,
  postDetails: postDetailsReducer,
});

export default rootReducer;
