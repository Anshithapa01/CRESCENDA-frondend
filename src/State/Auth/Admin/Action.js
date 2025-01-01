import axios from 'axios';
import { ADMIN_LOGIN_FAILURE, ADMIN_LOGIN_REQUEST, ADMIN_LOGIN_SUCCESS, ADMIN_LOGOUT, 
    GET_ADMIN_FAILURE, GET_ADMIN_REQUEST, GET_ADMIN_SUCCESS } from './ActionTypes';
import { ADMIN_AUTH_BASE_URL, ADMIN_BASE_URL } from '../../../Config/apiConfig';

const adminLoginRequest =()=>({type:ADMIN_LOGIN_REQUEST});
const adminLoginSuccess =(jwt)=>({type:ADMIN_LOGIN_SUCCESS, payload:jwt});
const adminLoginFailure =(error)=>({type:ADMIN_LOGIN_FAILURE,payload: error});

export const adminLogin = (adminData) => async (dispatch) => {
    dispatch(adminLoginRequest());
    try {
        console.log('adminData',adminData);
        
        const response = await axios.post(`${ADMIN_AUTH_BASE_URL}/login`, adminData);
        console.log('axios response',response);
        
        const { jwt } = response.data;

        localStorage.setItem('admin_jwt', jwt);
        dispatch(adminLoginSuccess(jwt));
        return Promise.resolve(jwt);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage); 
        dispatch(adminLoginFailure(error.response?.data?.message || error.message));
        return Promise.reject(new Error(errorMessage));
    }
};

const getAdminRequest =()=>({type:GET_ADMIN_REQUEST});
const getAdminSuccess =(user)=>({type:GET_ADMIN_SUCCESS, payload:user});
const getAdminFailure =(error)=>({type:GET_ADMIN_FAILURE,payload:error});

export const getAdmin = (jwt) => async(dispatch)=>{
    dispatch(getAdminRequest())
    try {
        const response=await axios.get(`${ADMIN_AUTH_BASE_URL}/profile`,{
            headers:{
                'Authorization': `Bearer ${jwt}`
            }
        })
        
        const user=response.data;
        dispatch(getAdminSuccess(user))
    } catch (error) {
        dispatch(getAdminFailure(error.message))
    }
}

export const logout=()=>(dispatch)=>{
    localStorage.removeItem('admin_jwt');
    dispatch({type:ADMIN_LOGOUT})
}
