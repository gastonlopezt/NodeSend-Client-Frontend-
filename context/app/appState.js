import React, {useReducer} from 'react'
import appContext from './appContext'
import appReducer from './appReducer'
import {
    MOSTRAR_ALERTA,
    OCULTAR_ALERTA,
    SUBIR_ARCHIVO_EXITO,
    SUBIR_ARCHIVO_ERROR,
    CREAR_ENLACE_EXITO,
    CREAR_ENLACE_ERROR,
    SUBIR_ARCHIVO,
    LIMPIAR_STATE,
    AGREGAR_PASSWORD,
    AGREGAR_DESCARGAS

} from '../../types'
import clienteAxios from '../../config/axios'


const AppState = ({children}) => {


    const initialState = {
        mensaje_archivo: null,
        nombre: '',
        nombre_original: '',
        cargando: null,
        descargas: 1,
        password: '',
        autor: null,
        url: '',
    }

    //Crear dispatch
    const [state, dispatch] = useReducer(appReducer, initialState)



    //mostrar una alerta
    const mostrarAlerta = msg => {
        console.log(msg)
        dispatch({
            type: MOSTRAR_ALERTA,
            payload: msg
        })
        setTimeout(() => {
            dispatch({
                type: OCULTAR_ALERTA,

            })
        }, 3000);
    }

    //Upload to server
    const subirArchivo = async (formData, nombreArchivo) => {

        dispatch({
            type: SUBIR_ARCHIVO,
        })

        try {
            const resultado = await clienteAxios.post('/api/archivos', formData);
            console.log(resultado.data)
            dispatch({
                type: SUBIR_ARCHIVO_EXITO,
                payload: {
                    nombre: resultado.data.archivo,
                    nombre_original: nombreArchivo
                }
            })
            
        } catch (error) {
            console.log(error)
            dispatch({
                type: SUBIR_ARCHIVO_ERROR,
                payload: error.response.data.msg,
            })
        }
    }

    //crear un enlace una vez subido el archivo
    const crearEnlace = async () => {
        const data = {
            nombre: state.nombre,
            nombre_original: state.nombre_original,
            descargas: state.descargas,
            password: state.password,
            autor: state.autor,
        }
        try {
            const resultado = await clienteAxios.post('/api/enlaces', data)
            dispatch({
                type: CREAR_ENLACE_EXITO,
                payload: resultado.data.msg
            })
        } catch (error) {
            console.log(error)
        }
    }


    const limpiarState = () => {
        dispatch({
            type: LIMPIAR_STATE
        })
    }


    const agregarPassword = password => {
        dispatch({
            type: AGREGAR_PASSWORD,
            payload: password
        })
    }

    const agregarDescargas = descargas => {
        dispatch({
            type: AGREGAR_DESCARGAS,
            payload: descargas
        })
    }


    return(
        <appContext.Provider
            value={{
                mensaje_archivo: state.mensaje_archivo,
                nombre: state.nombre,
                nombre_original: state.nombre_original,
                cargando: state.cargando,
                descargas: state.descargas,
                password: state.password,
                autor: state.autor,
                url: state.url,
                mostrarAlerta,
                subirArchivo,
                crearEnlace,
                limpiarState,
                agregarPassword,
                agregarDescargas
            }}
        >
            {children}
        </appContext.Provider>
    )

}

export default AppState;