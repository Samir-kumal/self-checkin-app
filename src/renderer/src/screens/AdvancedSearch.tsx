import { BASE_URL, Error_MESSAGE } from '@renderer/context/AuthContext'
import useAuthProvider from '@renderer/hooks/useAuthProvider'
import NavBar from '@renderer/layout/NavBar'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserDetailScreen from './UserDetailScreen'
import QrPrintComponent from '@renderer/components/QrPrintComponent'
import LoaderComponent from '@renderer/components/LoaderComponent'

const AdvancedSearch = () => {
  const { token } = useAuthProvider()
  const navigate = useNavigate()
  const [participantList, setParticipantList] = useState<[] | null>([])
  const [participantData, setParticipantData] = useState<any | null>(null)
  const [isPrint, setIsPrint] = useState(false)
  const [isAlreadyPrinted, setIsAlreadyPrinted] = useState(false)
  const [qrValue, setQrValue] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [printStatus, setPrintStatus] = useState({
    state: false,
    message: ''
  })
  const [error, setError] = useState({
    state: false,
    message: ''
  })
  const [input, setInput] = useState({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    organization: '',
    contact: '',
    regNo: '',
    payment: ''
  })

  const ipcHandle = () => window.electron.ipcRenderer.invoke('QR-Generate')
  const ipcResponseSuccess = () =>
    window.electron.ipcRenderer.on('print-success', ( args) => {
      console.log(args)
      UpdateQRCodePrintStatus(participantData.qr_code)
      setIsPrint(false)
      setIsAlreadyPrinted(true);
    })
  const ipcResponseError = () =>
    window.electron.ipcRenderer.on('print-error', ( args) => {
      console.log(args)
      setIsPrint(false)
      setPrintStatus({
        state: false,
        message: JSON.stringify(args)
      })
    })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      state: false,
      message: ''
    })
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeOption = (e: any) => {
    setError({
      state: false,
      message: ''
    })
    // handle the option change here
    setInput({
      ...input,
      payment: e.target.value
    })
  }

  const dataHeader = [
    'SN',
    'Full Name',
    'Contact',
    'Designation',
    'Hall',
    'Card Printed',
    'QR Code',
    'Actions'
  ]

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(
        `${BASE_URL}/api/search-list?fname=${input.fname}&mname=${input.mname}&lname=${input.lname}&email=${input.email}&organization=&${input.organization}phone=${input.contact}&registration_no=${input.regNo}&payment_method=${input.payment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(result.data, 'result from the advanced search')
      setParticipantList(result.data.data)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching data:', error)
      if (error instanceof AxiosError) {
        setError({
          state: true,
          message: error.response?.data.message
        })
      }
    } finally {
      // setInput({
      //   fname: '',
      //   mname: '',
      //   lname: '',
      //   email: '',
      //   organization: '',
      //   contact: '',
      //   regNo: '',
      //   payment: ''
      // })
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  //   useEffect(() => {}, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)
    console.log(input)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(isAlreadyPrinted, 'is already printed')
  const UpdateQRCodePrintStatus = async (qr_code) => {
    try {
      const result = await axios.get(`${BASE_URL}/api/update-print-status`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          qr_code: qr_code
        }
      })
      const data = result.data
      setPrintStatus({
        state: true,
        message: data.message
      })
      console.log(data, 'print status Updated')
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        setPrintStatus({
          state: false,
          message: error.response?.data.message
        })
      }
    } finally {
      // setTimeout(() => {
      //   setIsPrint(false)
      // }, 500)
    }
  }
  const handlePrint = () => {
    console.log('printing')
    if (participantData.card_printed === 'yes' || isAlreadyPrinted) {
      setPrintStatus({
        state: false,
        message: 'Card already printed'
      })
      setIsAlreadyPrinted(true)
      return
    }
    if (!isAlreadyPrinted) {
      setIsPrint(true)
      ipcHandle()
      ipcResponseSuccess()
      ipcResponseError()
    }
  }

  const handleGoBack = () => {
    setParticipantData(null)
    setPrintStatus({
      state: false,
      message: ''
    })
    setIsAlreadyPrinted(false);
    fetchData();
  }
  if (!isLoading && participantData && !isPrint) {
    return (
      <>
        <UserDetailScreen
          participantData={participantData}
          qrValue={qrValue}
          handlePrint={handlePrint}
          printStatus={printStatus}
          handleGoBack={handleGoBack}
        />
      </>
    )
  }

  if (isPrint && participantData) {
    console.log(qrValue, 'qr value')
    return <QrPrintComponent participantData={participantData} qrValue={qrValue} />
  }

  const handleFetchUserDetail = async (qr_code) => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${BASE_URL}/api/search-qr-code?qr_code=${qr_code}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = result.data
      console.log(data.data, 'result from the user detail')
      setParticipantData(data.data.particiapnt)
      setQrValue(data.data.qr_code_link)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      if (error instanceof AxiosError) {
        setError({
          state: true,
          message: error.response?.data.message
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataRefresh = () => {
    console.log('refreshing data')
    setInput({
      fname: '',
      mname: '',
      lname: '',
      email: '',
      organization: '',
      contact: '',
      regNo: '',
      payment: ''
    })
    // setParticipantList([])
    setIsSubmitted(true)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    fetchData()
    setError({
      state: false,
      message: ''
    })
  }

  return (
    <>
      <NavBar />
      <div className="w-full h-fit pb-4 border-b-2 relative">
        <h1 className="font-bold text-xl p-4">Advanced Search</h1>
        {/* <button
          onClick={() => navigate('/main')}
          className=" m-1 bg-[#0f2ea0] text-white absolute top-0 z-10 right-0 text-xs p-2"
        >
          {' '}
          Self Checkin
        </button> */}
        <button
          onClick={handleDataRefresh}
          className="bg-[#19a277] m-2  p-2 px-6 absolute top-0 z-10 right-4 text-white"
        >
          Refresh
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 relative sm:grid-cols-2 grid-cols-1 flex-wrap w-[97%] m-auto gap-4 ">
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                First name
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="First name"
                name="fname"
                value={input.fname}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Middle name
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Middle name"
                name="mname"
                value={input.mname}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Last name
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Last name"
                name="lname"
                value={input.lname}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Email
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Email"
                name="email"
                value={input.email}
                onChange={handleChange}
              />
            </div>
            {/* ===== 2nd row ======== */}
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Organization
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Organization"
                name="organization"
                value={input.organization}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Contact no.
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Contact no"
                name="contact"
                value={input.contact}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Registration no
              </label>
              <input
                className="border-[1px] border-black p-2 text-sm"
                type="text"
                placeholder="Registration no"
                name="regNo"
                value={input.regNo}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="search">
                Choose Payment method
              </label>
              <select
                className="border-[1px] border-black p-2 text-sm"
                value={input.payment}
                onChange={handleChangeOption}
                name="payment"
                id="payment"
              >
                <option value="">Choose</option>
                <option value="cash">Cash</option>
                <option value="free">free</option>
                <option value="bank">Bank Transfer</option>
                <option value="Himalayan Bank">Himalayan Bank</option>
              </select>
            </div>
          </div>
          <div className=" h-fit  col-span-8  px-6  relative my-2 flex justify-end  w-full m-auto  ">
            <button type="submit" className="bg-[#1D4389] p-2 px-6 text-white">
              Search
            </button>
          </div>
          <div className=" h-fit  col-span-8  px-6  relative my-2 flex justify-end  w-full m-auto  "></div>
        </form>
      </div>
      <div>
        <div className="flex w-[97vw] mx-auto h-fit justify-between bg-[#1D4389]">
          {dataHeader.map((header, index) => (
            <div
              key={index}
              className={` ${index === 0 ? 'w-fit mr-6 bg-black' : 'w-full'} text-white p-1 py-2`}
            >
              {header}
            </div>
          ))}
        </div>
        <div>
          {participantList && participantList.length > 0 ? (
            participantList.map((data: any, index: number) => (
              <div
                key={index}
                className={` w-[97vw] mx-auto h-fit ${data.card_printed === 'yes' ? 'bg-green-200' : ''} flex justify-between bg-gray-100`}
              >
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2  justify-start mr-6  min-w-fit  "
                >
                  {index + 1}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start  break-words  text-wrap h-fit w-full"
                >
                  {data.full_name}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-col flex-wrap justify-start  break-words px-2 text-wrap h-fit w-full"
                >
                  {data.email}
                  <p>{data.phone}</p>
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start px-2  break-words text-wrap h-fit w-full"
                >
                  {data.position}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start  break-words px-2 text-wrap h-fit w-full"
                >
                  {data.hall}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start break-words px-2 text-wrap h-fit w-full"
                >
                  {data.card_printed}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start break-words px-2 text-wrap h-fit w-full"
                >
                  {data.qr_code}
                </div>
                <div
                  style={{ wordBreak: 'break-word' }}
                  className="p-2 flex flex-row flex-wrap justify-start break-words px-2 text-wrap h-fit w-full"
                >
                  <button
                    onClick={() => handleFetchUserDetail(data.qr_code)}
                    className="bg-[#1D4389] p-2 px-4 text-white"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))
          ) : participantList &&
            participantList.length === 0 &&
            isSubmitted &&
            error.state !== true ? (
            <div className="w-full h-fit mt-4 flex justify-center items-center">
              <p className="text-red-500 text-sm">No data found</p>
            </div>
          ) : error.state === true ? (
            <div className="w-full h-60  mt-4 flex flex-col justify-center items-center">
              <p className="text-red-500 text-md">{error.message}</p>
              {error.message === Error_MESSAGE && (
                <button onClick={() => navigate('/')} className="bg-blue-800 m-2 p-2 text-white">
                  Login Again
                </button>
              )}
            </div>
          ) : (
            isLoading &&
            isSubmitted && (
              <div className="w-full h-fit mt-4 flex justify-center items-center">
                <div className=" animate-spin h-32 "></div>
                <p className="text-red-500 text-sm">Loading...</p>
              </div>
            )
          )}
        </div>
      </div>
      {isLoading && <LoaderComponent />}
    </>
  )
}

export default AdvancedSearch
