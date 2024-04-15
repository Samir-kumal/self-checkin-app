import LoaderComponent from '@renderer/components/LoaderComponent'

import  { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loader = () => {
  const navigate = useNavigate()

 
  useEffect(() => {
  
        navigate('/main')
  }, [])
  return (
    <LoaderComponent onboard />
  )
}

export default Loader
