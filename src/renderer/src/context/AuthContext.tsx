import { createContext, useEffect, useState } from 'react'

export interface AuthContextProps {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: any
  setUser: React.Dispatch<React.SetStateAction<any>>
  token: string | null  
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}
export const AuthContext = createContext<AuthContextProps | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export const BASE_URL = 'http://nis2024.innepal.biz'
export const Error_MESSAGE = 'Invalid token, Access Denied'

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  //   const jwtToken = store.get('jwtToken')
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(token ? true : false)
  const [user, setUser] = useState<any>(null)
  // const ipcHandleToken = () => window.electron.ipcRenderer.send('store', 'jwt')
  // const ipcHandleUser = () => window.electron.ipcRenderer.send('user', 'jwt')

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
    }
  }, [token])

  // useEffect(() => {
  //   const getJwtToken =  () => {
  //     ipcHandleToken()
  //     ipcHandleUser()
  //     const userData =  window.electron.ipcRenderer.on('user-data-reply', ( arg) => {
  //       console.log(arg, "user data")
  //       if (arg && !user) {
  //         // setUser(arg)
  //       }
  //     })
  //     userData();
      
  //     const tokenData =  window.electron.ipcRenderer.on('token-data-reply', ( arg) => {
  //       console.log(arg, "token data")
  //       if (arg && !token) {
  //         // setToken(arg)
  //       }
  //     })
  //     tokenData();
  //   }
    
  //   getJwtToken()
    
  // }, [isAuthenticated])

  console.log(isAuthenticated)
  console.log(user)
  console.log(token)
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
