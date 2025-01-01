import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import {thunk} from "redux-thunk"; // Corrected import for thunk
import { authReducer } from "./Auth/User/Reducer";
import { adminAuthReducer } from "./Auth/Admin/Reducer";
import { mentorAuthReducer } from "./Auth/Mentor/Reducer";
import { qaAuthReducer } from "./Auth/QA/Reducer";

const rootReducers = combineReducers({
    auth: authReducer,
    adminAuth: adminAuthReducer,
    mentorAuth:mentorAuthReducer,
    qaAuth:qaAuthReducer
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
