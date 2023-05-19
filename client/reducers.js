import { combineReducers } from "redux";
import registrationReducer from "./src/pages/RegistrationSlice";
import postDetailsReducer from "./src/pages/PostDetailsSlice";
// Import other reducers as needed

const rootReducer = combineReducers({
  registration: registrationReducer,
  postDetails: postDetailsReducer,
  // Add other reducers here
});

export default rootReducer;
