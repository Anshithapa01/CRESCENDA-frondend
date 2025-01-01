import axios from "axios"
import { GET_MENTOR_FAILURE, GET_MENTOR_REQUEST, 
    GET_MENTOR_SUCCESS, LOGOUT, MENTOR_LOGIN_FAILURE,
     MENTOR_LOGIN_REQUEST,
     MENTOR_LOGIN_SUCCESS, MENTOR_REGISTER_FAILURE,
      MENTOR_REGISTER_REQUEST, MENTOR_REGISTER_SUCCESS } from '../Mentor/ActionType'
import { MENTOR_AUTH_BASE_URL, MENTOR_BASE_URL } from "../../../Config/apiConfig";

const registerRequest =()=>({type:MENTOR_REGISTER_REQUEST});
const registerSuccess =(user)=>({type:MENTOR_REGISTER_SUCCESS, payload:user});
const registerFailure =(error)=>({type:MENTOR_REGISTER_FAILURE,payload:error});

export const register = (userData) => async(dispatch)=>{
    dispatch(registerRequest())
    try {
        const response=await axios.post(`${MENTOR_AUTH_BASE_URL}/auth/signup`,userData)
        const user=response.data;
        if(user.jwt){
            localStorage.setItem('jwt',user.jwt)
        }
        dispatch(registerSuccess(user.jwt))
        return Promise.resolve(user.jwt);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage); 
        dispatch(registerFailure(error.message))
        return Promise.reject(new Error(errorMessage));
    }
}

const loginRequest =()=>({type:MENTOR_LOGIN_REQUEST});
const loginSuccess =(user)=>({type:MENTOR_LOGIN_SUCCESS, payload:user});
const loginFailure =(error)=>({type:MENTOR_LOGIN_FAILURE,payload:error});

export const login = (userData) => async (dispatch) => {    
    dispatch(loginRequest());
    try {
        const response = await axios.post(`${MENTOR_AUTH_BASE_URL}/auth/signin`, userData);
        const user = response.data;

        if (user.jwt) {
            localStorage.setItem('jwt', user.jwt);
        }

        dispatch(loginSuccess(user.jwt));
        return Promise.resolve(user.jwt); // Explicitly return the token or user data
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage); 
        dispatch(loginFailure(errorMessage));
        return Promise.reject(new Error(errorMessage)); // Explicitly return the error
    }
};


const getUserRequest =()=>({type:GET_MENTOR_REQUEST});
const getUserSuccess =(user)=>({type:GET_MENTOR_SUCCESS, payload:user});
const getUserFailure =(error)=>({type:GET_MENTOR_FAILURE,payload:error});

export const getUser = (jwt) => async(dispatch)=>{
    dispatch(getUserRequest())
    try {
        const response=await axios.get(`${MENTOR_BASE_URL}/profile`,{
            headers:{
                'Authorization': `Bearer ${jwt}`
            }
        })
        
        const user=response.data;
        dispatch(getUserSuccess(user))
    } catch (error) {
        dispatch(getUserFailure(error.message))
    }
}

export const logout=()=>(dispatch)=>{
    localStorage.removeItem('jwt');
    dispatch({type:LOGOUT})
}