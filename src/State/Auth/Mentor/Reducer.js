import { GET_MENTOR_FAILURE, GET_MENTOR_REQUEST, GET_MENTOR_SUCCESS, LOGOUT, MENTOR_LOGIN_FAILURE, MENTOR_LOGIN_REQUEST, MENTOR_LOGIN_SUCCESS, MENTOR_REGISTER_FAILURE, MENTOR_REGISTER_REQUEST, MENTOR_REGISTER_SUCCESS } from "./ActionType"

const initialState={
    user:null,
    isLoading:false,
    error:null,
    jwt:localStorage.getItem("jwt") || null
}
export const mentorAuthReducer=(state=initialState,action)=>{
    switch(action.type){
        case MENTOR_REGISTER_REQUEST:
        case MENTOR_LOGIN_REQUEST:
        case GET_MENTOR_REQUEST:
            return{...state,isLoading:true,error:null}
        case MENTOR_REGISTER_SUCCESS:
        case MENTOR_LOGIN_SUCCESS:
            return{...state,isLoading:false,error:null,jwt:action.payload}
        case GET_MENTOR_SUCCESS:
            return{...state,isLoading:false,error:null,user:action.payload}
        case MENTOR_REGISTER_FAILURE:
        case MENTOR_LOGIN_FAILURE:
        case GET_MENTOR_FAILURE:
            return{...state,isLoading:false,error:action.payload}
        case LOGOUT:
            return{...initialState}
        default:
            return state;
    }
}