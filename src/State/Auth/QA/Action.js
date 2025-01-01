import axios from 'axios';
import { GET_QA_FAILURE, GET_QA_REQUEST, GET_QA_SUCCESS, 
    QA_LOGIN_FAILURE, QA_LOGIN_REQUEST, QA_LOGIN_SUCCESS, QA_LOGOUT } from './ActionTypes';
import { QA_AUTH_BASE_URL, QA_BASE_URL } from '../../../Config/apiConfig';

const qaLoginRequest =()=>({type:QA_LOGIN_REQUEST});
const qaLoginSuccess =(jwt)=>({type:QA_LOGIN_SUCCESS, payload:jwt});
const qaLoginFailure =(error)=>({type:QA_LOGIN_FAILURE,payload: error});

export const qaLogin = (qaData) => async (dispatch) => {
    dispatch(qaLoginRequest());
    try {
        const response = await axios.post(`${QA_AUTH_BASE_URL}/login`, qaData);
        const qa = response.data;
        localStorage.setItem('qa_jwt', qa.jwt);
        dispatch(qaLoginSuccess(qa.jwt)); 
        return Promise.resolve(qa.jwt);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.log(errorMessage); 
        dispatch(qaLoginFailure(error.message));
        return Promise.reject(new Error(errorMessage));
    }
};

const getQaRequest =()=>({type:GET_QA_REQUEST});
const getQaSuccess =(user)=>({type:GET_QA_SUCCESS, payload:user});
const getQaFailure =(error)=>({type:GET_QA_FAILURE,payload:error});

export const getQa = (jwt) => async(dispatch)=>{
    dispatch(getQaRequest())
    try {
        const response=await axios.get(`${QA_AUTH_BASE_URL}/profile`,{
            headers:{
                'Authorization': `Bearer ${jwt}`
            }
        })
        
        const user=response.data;
        dispatch(getQaSuccess(user))
    } catch (error) {
        dispatch(getQaFailure(error.message))
    }
}

export const logout=()=>(dispatch)=>{
    localStorage.removeItem('qa_jwt');
    dispatch({type:QA_LOGOUT})
}
