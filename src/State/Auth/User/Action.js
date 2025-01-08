import axios from "axios"
import { API_AUTH_BASE_URL, API_BASE_URL } from "../../../Config/apiConfig"
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType"


const registerRequest =()=>({type:REGISTER_REQUEST});
const registerSuccess =(user)=>({type:REGISTER_SUCCESS, payload:user});
const registerFailure =(error)=>({type:REGISTER_FAILURE,payload:error});

export const register = (userData) => async(dispatch)=>{
    console.log('userData',userData);
    
    dispatch(registerRequest())
    try {
        const response=await axios.post(`${API_AUTH_BASE_URL}/auth/signup`,userData)
        const user=response.data;
        if(user.jwt){
            localStorage.setItem('user_jwt',user.jwt)
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

const loginRequest =()=>({type:LOGIN_REQUEST});
const loginSuccess =(user)=>({type:LOGIN_SUCCESS, payload:user});
const loginFailure =(error)=>({type:LOGIN_FAILURE,payload:error});

export const login = (userData) => async(dispatch)=>{
    dispatch(loginRequest())
    try {
        const response=await axios.post(`${API_AUTH_BASE_URL}/auth/signin`,headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
         userData)
        console.log(response.data);  
        const user=response.data;   
        if(user.jwt){
            localStorage.setItem('user_jwt',user.jwt)            
        }   
        dispatch(loginSuccess(user.jwt))
        return Promise.resolve(user.jwt);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(loginFailure(errorMessage));
        return Promise.reject(new Error(errorMessage));
    }
}

const getUserRequest =()=>({type:GET_USER_REQUEST});
const getUserSuccess =(user)=>({type:GET_USER_SUCCESS, payload:user});
const getUserFailure =(error)=>({type:GET_USER_FAILURE,payload:error});

export const getUser = (jwt) => async(dispatch)=>{
    dispatch(getUserRequest())
    try {
        const response=await axios.get(`${API_BASE_URL}/student/profile`,{
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
    localStorage.removeItem('user_jwt');
    dispatch({type:LOGOUT})
}