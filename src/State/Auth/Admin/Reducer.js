import { LOGOUT } from "../User/ActionType";
import { ADMIN_LOGIN_FAILURE, ADMIN_LOGIN_REQUEST, ADMIN_LOGIN_SUCCESS,
     GET_ADMIN_FAILURE, GET_ADMIN_REQUEST, GET_ADMIN_SUCCESS } from "./ActionTypes";

const initialState = {
    user:null,
    adminJwt: localStorage.getItem("admin_jwt") || null,
    isLoading: false,
    error: null,
};

export const adminAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_LOGIN_REQUEST:
            return { ...state, isLoading: true, error: null };
        case ADMIN_LOGIN_SUCCESS:
            return { ...state, isLoading: false, adminJwt: action.payload };
        case ADMIN_LOGIN_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case GET_ADMIN_SUCCESS:
        return{...state,isLoading:false,error:null,user:action.payload}
        case GET_ADMIN_FAILURE:
            return{...state,isLoading:false,error:action.payload}
        case GET_ADMIN_REQUEST:
            return{...state,isLoading:true,error:null}
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};
