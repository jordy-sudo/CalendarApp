import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onCheking, onLogin, onLogout } from "../store";

export const useAuthStore =()=>{
    const {status,user,errorMessage} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    const startLogin = async({email,password})=>{
        dispatch(onCheking());
        try {
            const {data} = await calendarApi.post('/auth',{email,password});
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({name:data.name,uid:data.uid}));
        } catch (error) {
            dispatch(onLogout('Credenciales invalidas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());               
            }, 10);
        }
    };
     
    const startRegister = async({name,email,password})=>{
        dispatch(onCheking());
        try {
            const {data} = await calendarApi.post('auth/new',{name,email,password});
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({name:data.user, uid:data.uid}));
        } catch (error) {
            var {data} = error.response;
            dispatch(onLogout(data.msg));
            setTimeout(() => {
                dispatch(clearErrorMessage());               
            }, 70);
        }
    }

    const checkAuthToken = async()=>{
        const token = localStorage.getItem('token');
        if(!token) return dispatch(onLogout());
        try {
            const {data} = await calendarApi.get('auth/renew');
            localStorage.setItem('token',data.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(onLogin({name: data.name, uid: data.uid}));
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogOut = ()=>{
        localStorage.clear();
        dispatch(onLogout());
    }



    return{
        // Propiedades
        errorMessage,
        status,
        user,
        // Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogOut,
    }
}