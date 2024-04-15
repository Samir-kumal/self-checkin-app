import  { useContext } from 'react'
// custom hook to get the context value
import { AuthContext } from '../context/AuthContext'


const useAuthProvider = () => {
const context = useContext(AuthContext);


    if (!context) {
        throw new Error('useDataProvider must be used within a DataProvider')
    }
    return context;

}

export default useAuthProvider