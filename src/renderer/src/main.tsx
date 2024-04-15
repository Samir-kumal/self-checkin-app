import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import {  RouterProvider, createHashRouter } from 'react-router-dom'
// import Login from './screens/Login'
import App from './screens/MainScreen'
// import ProtectedRoutes from './screens/ProtectedRoutes'
import AuthProvider from './context/AuthContext'
import Loader from './screens/Loader'
import AdvancedSearch from './screens/AdvancedSearch'

const router = createHashRouter([
  // {
  //   path: '/login',
  //   element: <Login />
  // },

  {
    path: '/',
    element: <Loader />,
  
  },
  {
    path: '/main',
    element: <App />
  },
  {
    path: '/advanced-search',
    element: <AdvancedSearch />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
