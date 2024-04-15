import React, { useEffect, useState } from 'react'
// import { PosPrinter, PosPrintData, PosPrintOptions } from 'electron-pos-printer'
import QRCode from 'react-qr-code'
// import { useNavigate } from 'react-router-dom'
import NavBar from '../layout/NavBar'
// const { ipcRenderer } = window.require('electron');

interface dataProps {
  name: string
}
const DetailScreen = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<dataProps[] | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPrint, setIsPrint] = useState(false)
  const [qrValue, setQrValue] = useState<number | null>(null)
  const ipcHandle = () => window.electron.ipcRenderer.send('QR', 'Hello from renderer process')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  // const navigate = useNavigate()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // ipcRenderer.send('print', JSON.stringify(input));

    setIsSubmitted(true)
    e.preventDefault()
    const filteredData = data.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase())
    })
    setResult(filteredData)
    console.log(input)
  }
  const data = [
    {
      name: 'Ramesh'
    },
    {
      name: 'Suresh'
    },
    {
      name: 'Samir'
    },
    {
      name: 'Sandip'
    },
    {
      name: 'Mandip'
    },
    {
      name: 'Kandip'
    },
    {
      name: 'Shreeya'
    },
    {
      name: 'Prajit'
    },
    {
      name: 'Suresh'
    }
  ]

  const submenuRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Function to handle clicks outside the submenu
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsModalVisible(false) // Close the submenu if clicked outside
      }
    }

    // Attach event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside)

    // Detach event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []) // Empty dependency array ensures the effect runs only once on mount

  console.log('Main Page rendered')

  const handleActions = () => {
    // const options: PosPrintOptions = {
    //   preview: false,
    //   width: '170px',
    //   margin: '0 0 0 0',
    //   copies: 1,
    //   printerName: 'POS-80'
    // }
    // const data: PosPrintData[] = [
    //   {
    //     type: 'text',
    //     value: 'Hello World',
    //     style: `text-align:center;`
    //   }
    // ]
    // PosPrinter.print(data, options)
    setIsModalVisible(!isModalVisible)
  }

  const handlePrintQR = () => {
    // setIsPrint(true);
    generateQR()
  }

  const generateQR = () => {
    setIsPrint(true)
    setQrValue(Math.floor(Math.random() * 100000))
  }

  if (isPrint && qrValue) {
    return (
      <div
        style={{
          height: '100%',
          margin: '0 auto',
          width: '100%',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          rowGap: '20px',
          paddingTop: '50px'
        }}
      >
        <button
          className="bg-blue-500 absolute left-0 bottom-0 p-2  h-fit w-20 text-white"
          onClick={() => {
            setIsPrint(false)
            setQrValue(null)
          }}
        >
          go back
        </button>
        <button
          className="bg-blue-500 absolute right-0 bottom-0  h-fit p-2 w-20 text-white"
          onClick={() => {
            ipcHandle()
          }}
        >
          Print
        </button>
        <h1 className=" font-bold text-6xl ">Samir Kumal</h1>
        <h1 className=" font-bold text-3xl ">React Native Developer</h1>
        <h1 className=" font-bold text-xl font-serif ">Outlines Research and Development</h1>
        <QRCode
          size={56}
          style={{ height: 'auto', maxWidth: '100%', width: 200 }}
          value={qrValue.toString()}
          viewBox={`0 0 256 256`}
        />
        <p>{qrValue}</p>
      </div>
    )
  }

  return (
    <>
      {!isPrint && !qrValue && <NavBar />}

      <div className="flex flex-col h-fit bg-white mb-10 justify-center items-center">
        <h1 className="text-2xl font-bold text-center mt-20">Check Entry list</h1>
        <div className=" w-10/12 m-auto h-fit flex flex-col pb-6 items-center bg-gray-300 rounded-md">
          <form
            onSubmit={handleSubmit}
            className="flex h-20 w-11/12 flex-row justify-center items-center gap-x-3 "
          >
            <input
              name="name"
              value={input}
              onChange={handleChange}
              type="text"
              className="w-full h-10 rounded-md border p-4 border-gray-300"
              placeholder="Enter your name"
            />
            <button type="submit" className="w-20 h-10 bg-[#000929] text-white rounded-md ">
              Submit
            </button>
          </form>
          <div className="bg-white w-11/12 rounded-md m-auto h-fit">
            <div className="flex flex-row justify-between px-4 rounded-t-md bg-[#000929] text-white p-2 mb-4 font-bold">
              <h1>SN</h1>
              <h1>Full Name</h1>
              <h1>Contact</h1>
              <h1>Designation</h1>
            </div>
            {result && result.length > 0
              ? result.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full h-10 flex justify-between relative items-center px-4 border-b border-gray-300"
                    >
                      <p>{item.name}</p>
                      <p>Present</p>
                      <button onClick={handleActions} className="w-2 h-auto ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>
                        {isModalVisible && (
                          <div
                            ref={submenuRef}
                            className="h-20 w-32 bg-slate-600 absolute right-10 flex items-center justify-center top-0"
                          >
                            <ul className="h-full">
                              <button
                                onClick={handlePrintQR}
                                className="hover:opacity-50 bg-gray-300 w-full h-1/2"
                              >
                                <li>Print QR</li>
                              </button>
                              <button className="hover:opacity-50 bg-gray-300 w-full h-1/2">
                                <li>View Participant</li>
                              </button>
                            </ul>
                          </div>
                        )}
                      </button>
                    </div>
                  )
                })
              : input.length > 0 &&
                isSubmitted && (
                  <div className="p-4">
                    <p className="text-center">No data found</p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailScreen
