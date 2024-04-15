// import useAuthProvider from '@renderer/hooks/useAuthProvider'
// import React, { useLayoutEffect } from 'react'
// import { Navigate, Outlet, useLocation } from 'react-router-dom'
// import App from './MainScreen'
// import Loader from './Loader'

// const ProtectedRoutes = () => {
//   const {isAuthenticated,token} = useAuthProvider()
//   console.log(isAuthenticated)
//   const location = useLocation()
//   useLayoutEffect(() => {
//     window.scrollTo(0, 0)
//   }, [location.pathname])
//   return  !token ? (
//     <Loader />
//   ) : (
//     <Navigate to={'/login'} state={{ from: location }} replace />
//   )
// }
// export default ProtectedRoutes
