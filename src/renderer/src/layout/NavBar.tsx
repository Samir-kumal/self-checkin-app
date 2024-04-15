import React, { useEffect, useRef } from 'react'
import Logo from '../assets/nis.png'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthProvider from '@renderer/hooks/useAuthProvider'
import LoaderComponent from '@renderer/components/LoaderComponent'
const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { setIsAuthenticated } = useAuthProvider()
  const { isAuthenticated, user, setUser } = useAuthProvider()
  const [isLoading, setIsLoading] = React.useState(false)

  console.log(user)
  console.log(isAuthenticated, "from navbar")

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleLogout = () => {
    console.log('clicked')
    setIsLoading(true)
    setIsAuthenticated(false)
    setUser(null)
    const ipcHandleToken = () => window.electron.ipcRenderer.invoke('clearToken')
    const ipcHandleUser = () => window.electron.ipcRenderer.invoke('clearUser')
    ipcHandleToken()
    ipcHandleUser()
    setTimeout(() => {
      setIsLoading(false)
      navigate('/login')
    }, 1000)
  }

  return (
    <>
      <div className=" h-[10vh] w-full bg-[#000929] text-white flex flex-row items-center justify-normal">
        <img src={Logo} alt="logo" className="h-full w-auto ml-4" />
        <div className="w-full flex justify-start px-4">
          <h1 className="lg:text-2xl md:text-xl sm:text-md font-bold">Nepal Investment Summit 2024</h1>
        </div>

        {isAuthenticated && user && location.pathname === '/main' && (
          <div ref={menuRef} className="relative  h-full flex flex-row items-center ">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-[#1b38a3] text-white flex flex-row items-center gap-x-2 px-4 py-2 mr-6"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 59 63"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.4375 62.625C5.4375 62.625 0.625 62.625 0.625 57.4375C0.625 52.25 5.4375 36.6875 29.5 36.6875C53.5625 36.6875 58.375 52.25 58.375 57.4375C58.375 62.625 53.5625 62.625 53.5625 62.625H5.4375ZM29.5 31.5C33.3291 31.5 37.0013 29.8604 39.7089 26.9418C42.4164 24.0233 43.9375 20.0649 43.9375 15.9375C43.9375 11.8101 42.4164 7.85169 39.7089 4.93315C37.0013 2.01462 33.3291 0.375 29.5 0.375C25.6709 0.375 21.9987 2.01462 19.2911 4.93315C16.5836 7.85169 15.0625 11.8101 15.0625 15.9375C15.0625 20.0649 16.5836 24.0233 19.2911 26.9418C21.9987 29.8604 25.6709 31.5 29.5 31.5Z"
                  fill="white"
                />
              </svg>

              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </button>
            {isMenuOpen && (
              <div className="w-fit h-fit bg-blue-500 p-2 absolute flex z-50 flex-col gap-y-2 items-center justify-around -bottom-24 right-1">
                <p>{user?.email}</p>
                <button className="border-2 p-2 w-full  ">
                  <p onClick={handleLogout} className="text-white">
                    Logout
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isLoading && <LoaderComponent />}
    </>
  )
}

export default NavBar
