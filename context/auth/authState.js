import React, { useReducer } from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";
import { REGISTRO_EXITOSO, REGISTRO_ERROR, LIMPIAR_ALERTA, LOGIN_ERROR, LOGIN_EXITOSO, USUARIO_AUTENTICADO, CERRAR_SESION } from "../../types";
import tokenAuth from "../../config/tokenAuth";
import clienteAxios from "../../config/axios";


const AuthState = ({children}) => {

    //initial state
    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null,
        cargando: null,
    }

    //reducer
    const [state, dispatch] = useReducer(authReducer, initialState); 

    //register new users
    const registrarUsuario = async datos => {
        try {
            const respuesta = await clienteAxios.post('/api/usuarios', datos)
            
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            });
        } catch (error) {
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })
        }
        //Clean Alert
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,
            })
        }, 3000);
    }

    //Valid User
    const iniciarSesion = async datos => {
        try {
            const respuesta = await clienteAxios.post('/api/auth', datos);
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })
            
            
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
        //Clean Alert
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,
            })
        }, 3000);        
    }


    //Valid user with JWT
    const usuarioAutenticado = async ( ) => {
        const token  = localStorage.getItem('token');
        if(token) {
            tokenAuth(token)
        }
        try {
            const respuesta = await clienteAxios.get('/api/auth')
            
            if(respuesta.data.usuario) {
                dispatch({
                    type: USUARIO_AUTENTICADO,
                    payload: respuesta.data.usuario,
                    
                })

            }
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
    }


    //Close 
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }


    return(
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                cargando: state.cargando,
                usuarioAutenticado,
                registrarUsuario,
                iniciarSesion,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
    )

}


export default AuthState;
