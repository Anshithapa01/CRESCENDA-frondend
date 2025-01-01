import { GET_QA_FAILURE, GET_QA_REQUEST, GET_QA_SUCCESS, QA_LOGIN_FAILURE, QA_LOGIN_REQUEST, QA_LOGIN_SUCCESS, QA_LOGOUT } from "./ActionTypes";

const initialState = {
    user:null,
    qaJwt: localStorage.getItem("qa_jwt") || null,
    isLoading: false,
    error: null,
};

export const qaAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case QA_LOGIN_REQUEST:
            return { ...state, isLoading: true, error: null };
        case QA_LOGIN_SUCCESS:
            return { ...state, isLoading: false, qaJwt: action.payload };
        case QA_LOGIN_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case GET_QA_SUCCESS:
        return{...state,isLoading:false,error:null,user:action.payload};
        case GET_QA_FAILURE:
            return{...state,isLoading:false,error:action.payload}
        case GET_QA_REQUEST:
            return{...state,isLoading:true,error:null}
        case QA_LOGOUT:
            return initialState;
        default:
            return state;
    }
};
