import NavBar from '@renderer/layout/NavBar'
import { isValidEmail } from '@renderer/utility/isEmailValid'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { BASE_URL } from '@renderer/context/AuthContext'
import useAuthProvider from '@renderer/hooks/useAuthProvider'
import LoaderComponent from '@renderer/components/LoaderComponent'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState({
    email: false,
    emailErrorMsg: '',
    password: false,
    passwordErrorMsg: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setIsAuthenticated, setToken } = useAuthProvider()

  const [errorResponse, setErrorResponse] = useState('')

  const navigate = useNavigate()
  const validate = () => {
    let isValid = true
    let isEmailValid = isValidEmail(credentials.email)
    console.log(isEmailValid, 'isEmailValid')
    if (credentials.email.length === 0 && credentials.password.length === 0) {
      setError((prevError) => ({
        ...prevError,
        email: true,
        emailErrorMsg: 'Email is required',
        password: true,
        passwordErrorMsg: 'Password is required'
      }))
      return false
    }
    if (credentials.email.length > 0 && isEmailValid === false) {
      setError((previousState) => ({
        ...previousState,
        email: true,
        emailErrorMsg: 'Email is invalid'
      }))
      isValid = false
    }

    // else if (credentials.password.length !==0 && credentials.password.length < 6) {
    //   setError((prevError) => ({
    //     ...prevError,
    //     password: true,
    //     passwordErrorMsg: 'Password is required'
    //   }))
    //   return false
    // }
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }))
    if (name === 'email') {
      setError((prevError) => ({
        ...prevError,
        email: false,
        emailErrorMsg: ''
      }))
    } else if (name === 'password') {
      setError((prevError) => ({
        ...prevError,
        password: false,
        passwordErrorMsg: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) {
      return
    }
    setIsLoading(true)

    if (validate()) {
      try {
        const result = await axios.post(`${BASE_URL}/api/desktop-login`, {
          email: credentials.email,
          password: credentials.password
        })
        const data = result.data
        if (data) {
          console.log(data)
          setUser(data.message)
          setIsAuthenticated(true);
          setToken(data.jwt)
          // store.set('jwtToken',data.jwt);
          // setToken(data.jwt)
          // const ipcHandleToken = () => window.electron.ipcRenderer.invoke('setToken', data.jwt)
          // const ipcHandleUser = () => window.electron.ipcRenderer.invoke('setUser', data.message)
          // ipcHandleToken()
          // ipcHandleUser()
        }
        setTimeout(() => {
          setIsLoading(false)
          navigate('/main')
        }, 1000)
      } catch (error) {
        console.log(error)
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message)
          setErrorResponse(error.response?.data.message)
        }
      } finally {
        setTimeout(()=>{
          setIsLoading(false)
        
        },1000)
      }
    }
  }
  return (
    <div className="bg-gray-100">
      <NavBar />
      <div className="h-[85lvh] w-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white flex flex-col gap-y-6 lg:w-1/3 md:w-1/2 w-10/12 shadow-md rounded px-8 mt-20 pt-6 pb-8 mb-4"
        >
          <h1 className="text-3xl text-center font-bold">Event Management</h1>
          <h2 className="text-xl text-center font-bold">Desktop app</h2>

          <h2 className="text-center">Sign in</h2>
          <div className="flex flex-col gap-y-2">
            <input
              value={credentials.email}
              onChange={handleChange}
              className={`shadow appearance-none border ${error.email ? 'border border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="email"
              name="email"
              type="text"
              placeholder="Email"
            />
            <span className="text-red-500 text-sm">{error.emailErrorMsg}</span>
            <input
              value={credentials.password}
              onChange={handleChange}
              className={`shadow appearance-none border ${error.password ? 'border border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <span className="text-red-500 text-sm">{error.passwordErrorMsg}</span>
            <span className="text-red-500 text-sm">{errorResponse}</span>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
      {isLoading && <LoaderComponent />}
    </div>
  )
}

export default Login
