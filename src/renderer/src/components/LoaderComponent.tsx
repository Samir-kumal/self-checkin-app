
interface LoaderComponentProps {
    onboard?: boolean
    }
const LoaderComponent:React.FC<LoaderComponentProps> = ({onboard}) => {
  return (
    <div className={`inset-0 absolute h-screen w-screen ${onboard ? "bg-white" :"bg-black/40"} flex flex-row items-center justify-center`}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-6 border-blue-500"></div>
    </div>
  )
}

export default LoaderComponent
