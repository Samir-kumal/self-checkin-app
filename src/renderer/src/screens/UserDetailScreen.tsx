import NavBar from '@renderer/layout/NavBar'
import '../styles/detailScreen.css'
const UserDetailScreen = ({ participantData, qrValue, handleGoBack, handlePrint, printStatus }) => {

  const Hall = "Sur Sudha Sargam Hall";
  return (
    <>
      <NavBar />
      <div className='flex w-[97vw]  m-auto  h-fit  py-4  justify-end'>
      <button onClick={handleGoBack} className="bg-[#1D4389] text-white px-4 py-2 rounded-md">
          Go Back
        </button>
      </div>
      <div className="bg-white w-[97vw] flex lg:flex-row md:flex-row flex-col p-4  items-center justify-between h-fit mt-1  m-auto border-2 border-black rounded-md">
        {/* User Data Section */}

        <div className=" max-h-fit w-1/2 p-2">
          <h1 className="text-left text-3xl mb-4 font-bold">Participant Information</h1>

          <div className="flex lg:flex-row md:flex-row flex-col h-full w-full  items-start  justify-between">
            <div className="h-full">
              <p className="font-bold">Full Name</p>
              <p>{participantData.full_name}</p>

              <p className="font-bold">Email</p>
              <p>{participantData.email}</p>

              <p className="font-bold">Phone no.</p>
              <p>{participantData.phone}</p>
            </div>
            <div>
              <p className="font-bold">Position</p>
              <p>{participantData.position}</p>

              <p className="font-bold">Organization Name</p>
              <p>{participantData.organization_name}</p>
              <p className="font-bold">Hall </p>
              <p>{participantData.hall}</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex items-center justify-center w-[20rem] gap-x-2  h-60 pl-2 ">
          {/* <h1 className="text-center font-bold text-xl">
              {participantData.title} {participantData.full_name}
            </h1>
            <h1 className="text-center font-bold text-xl">{participantData.position}</h1>
            <h1 className="text-center italic">{participantData.organization_name}</h1> */}
          <div className="flex flex-col items-center justify-center"> 
          { participantData.hall === Hall && <div className='h-1 w-1 bg-black'></div>}
            <img src={qrValue} alt="qr-code" className=" h-full w-28" />
            <p className="text-[10px]">{participantData.qr_code}</p>
          </div>
          {/* <p></p> */}
          <div className="w-3/4 ">
            <h1 style={{wordBreak:'break-word'}} className="userTitle font-serif">
              {' '}
              {(participantData.title).toUpperCase()} {(participantData.full_name).toUpperCase()}
            </h1>
            <div className="">
              <h1 className="userPosition font-serif"> {participantData.position}</h1>
              
              <h1 className="userOrganization font-serif"> {participantData.organization_name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[97vw]  flex m-auto my-4 h-fit flex-row justify-end items-center">
       
        <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Print QR
        </button>
      </div>
      <div className="w-full flex justify-center">
        <p>
          <span
            className={`font-bold ${printStatus.state === true ? 'text-green-500' : 'text-red-500'}`}
          >
            {printStatus.message}
          </span>
        </p>
      </div>
    </>
  )
}

export default UserDetailScreen
