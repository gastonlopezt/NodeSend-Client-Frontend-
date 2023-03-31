import React from 'react'

import '@/styles/globals.css'
import AuthState from '../context/auth/authState'
import AppState from '../context/app/appState'


const myApp = ({Component, pageProps}) => {
  return (
    <React.StrictMode>
      <AuthState>
        <AppState>
          <Component {...pageProps} />
        </AppState>
        
      </AuthState>
    </React.StrictMode>
  )
}

export default myApp;








