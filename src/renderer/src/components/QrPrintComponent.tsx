import '../styles/qrPrintScreen.css'
const QrPrintComponent = ({ participantData, qrValue }) => {
  const Hall = 'Sur Sudha Sargam Hall'
  const fullName = participantData.full_name.toUpperCase()
  const fullNameArray = fullName.split(' ')
  // const lastIndex = fullNameArray.length - 1

  return (
    <div className="qrPrintScreen flex w-full  gap-x-4 h-screen  flex-row items-start justify-center">
      <div
        className={`flex flex-row items-center justify-center  w-full h-fit ${fullNameArray[0].length > 7 ? 'mt-16' : 'mt-8'}`}
      >
        <div className="flex flex-col items-center justify-center relative">
          {participantData.hall === Hall && <div className="h-3 w-3 bg-black"></div>}
          <img src={qrValue ? qrValue : ''} alt="qr-code" width={260} height={'auto'} />
          <p className=" font-semibold text-lg absolute -bottom-2">{participantData.qr_code}</p>
        </div>
        <div className="w-[26rem] flex flex-col   ">
          <h1
            className={` userTitleQR font-serif font-bold ${fullNameArray[0].length > 7 ? 'text-[30px]' : fullNameArray[0].length === 7 ? 'text-[40px]' : fullNameArray[0].length === 6 ? 'text-[40px]' : 'text-[50px]'} leading-snug `}
          >
            {participantData.title.toUpperCase()} {fullName}
          </h1>
          <h1
            className={`userPositionQR font-serif ${fullNameArray[0].length > 7 ? 'text-[26px]' : 'text-[36px]'}  `}
          >
            {participantData.position}
          </h1>
          <h1
            className={`userOrganizationQR   font-serif leading-tight ${fullNameArray[0].length > 7 ? 'text-[26px]' : 'text-[36px]'} `}
          >
            {participantData.organization_name}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default QrPrintComponent
