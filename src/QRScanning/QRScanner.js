import React, { Component, useRef, useState } from 'react'
import QrReader from 'react-qr-scanner'
import { VStack, Button, CheckboxGroup, Checkbox, Text, useToast, Box, Heading, HStack } from '@chakra-ui/react'
import api from '../api'
import useSound from "use-sound"
import beep from '../Audio/short_beep.wav'
import ReactToPrint, { useReactToPrint } from 'react-to-print'
import { ComponentToPrint } from '../Reception/HomePage/TokenPrint'
import { QRTokenPrint } from './QRTokenPrint'
import { useEffect } from 'react'
import { FullPageSpinner } from '../components/Spinner'

export const QRScanner = () => {

  const [result, setResult] = useState([])
  const [resultForPrint, setResultForPrint] = useState([])
  const [activate, setActivate] = useState(false)
  const [checked, setChecked] = useState([])
  const [message, setMessage] = useState("")
  const [walkin, setWalkin] = useState([])
  let componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    //onAfterPrint: () => arrivedQR
  })
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const [playActive] = useSound(beep, { volume: 0.5 });

  let count = 0

  // useEffect(() => {
  //   if (resultForPrint) {
  //       handlePrint()
  //   }
  //   setResultForPrint()
  // }, [resultForPrint])

  useEffect(() => {

  }, [])

  function handleScan(data) {
    setIsLoading(true)
    //console.log(data)
    if (data && count == 0) {
      setActivate(false)
      count += 1
      if (count == 1)
        playActive()
      let info = data?.text.split("-")
      api.token.scanQr({ tokenID: info[0], phone: info[1] }).then((res) => {
        setIsLoading(false)
        setActivate(false)
        let response = JSON.parse(res.data)
        if (response.onlyOne) {
          if (response.onlyOne.arrived) {

            setResultForPrint(response.onlyOne.arrived)
          }
          if (response.onlyOne.delayed) {
            setMessage(response.onlyOne.delayed)

          }
          if (response.onlyOne.walkin) {
            setWalkin(response.onlyOne.walkin)

          }
          setTimeout(() => {
            window.location.reload()
          }, 10000)
          setActivate(false)
        }
        else {
          if (response.result) {
            setResult(response.result[1])
            setChecked([response.patient])

            setTimeout(() => {
              window.location.reload()
            }, 60000)
          }
          if (response.message) {
            setMessage(response.message)
            setTimeout(() => {
              window.location.reload()
              // setResult([])
              // setMessage("")
            }, 10000)
            setActivate(false)
          }
        }

      }).catch((err) => {
        setIsLoading(false)
      })
    }
  }


  function arrivedQR() {
    setIsLoading(true)
    api.token.arrivedQR({ item: checked }).then((res) => {
      setIsLoading(false)
      setResult([])
      setChecked([])
      const response = JSON.parse(res.data)
      if (response.arrived) {
        setResultForPrint(response.arrived)
      }
      if (response.delayed) {
        setMessage(response.delayed)

      }
      if (response.walkin) {
        setWalkin(response.walkin)
      }
      setActivate(false)
      setTimeout(() => {
        window.location.reload()
        // setMessage("")
      }, 10000)
    }).catch((err) => {
      setIsLoading(false)
    })
  }

  function handleError(err) {
    console.error(err)
  }

  const previewStyle = {
    height: 500,
    width: 500,
  }

  function ActivateQR() {

    setActivate(true)
    setMessage("")
    setResult([])
    setChecked([])
    setTimeout(() => {
      setActivate(false)
    }, 120000);
  }

  function handleChange(e) {
    if (e.target.checked) {
      setChecked(prev => ([...prev, parseInt(e.target.value)]))
    }
    else {
      setChecked(checked.filter((item) => item != e.target.value))
    }

    console.log(checked)
  }


  function tokenNumber(item) {
    let tokenNumber = ""
    if (item.slot.includes("W")) {
      if (item.tokenNumber)
        tokenNumber += `${item.initials}W-${item.tokenNumber}`
      else
        tokenNumber += `W`
    }

    else
      tokenNumber += `${item.initials}-${item.tokenNumber} `

    return tokenNumber
  }

  function goBack() {
    setIsLoading(true)
    window.location.reload()
  }

  return (
    <>

      {/* {activate ? */}

      {/* <Button onClick={ActivateQR} width={"fit-content"} mb={10} colorScheme={"blue"}>Tap to Scan QR Code</Button > */}
      < QrReader
        delay={100}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan} />

      {isLoading ? <FullPageSpinner /> :
        <>
          {/* : <Button onClick={ActivateQR} width={"fit-content"} mb={10} colorScheme={"blue"}>Tap to Scan QR Code</Button >} */}
          {result.length == 0 && <>
            {resultForPrint.length > 0 && <VStack rounded="lg" boxShadow="outline" m={1} p={2} >


              {resultForPrint.map(i => (
                <VStack >
                  <Heading size="sm">{i.name}</Heading>
                  <HStack spacing="3">
                    <Text>Token: <b>{tokenNumber(i)}</b></Text>
                    {i.timeInEst && <Text>Est. Time: <b>{new Date('1970-01-01T' + i.timeInEst + 'Z')
                      .toLocaleTimeString('en-US',
                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}</b></Text>}
                    <Text>Doctor: <b>{i.docName}</b></Text>
                  </HStack>
                </VStack>
              ))}

            </VStack >}
            {message ?
              <Box m={2} bg="white" rounded="lg" p={2}>
                <Heading size="md" color="red">{message}</Heading>
              </Box> :
              null}
            {walkin.length > 0 && <VStack m={2} bg="white" rounded="lg" p={2} >
              {walkin.map(i => (
                <VStack >
                  <Heading color="red" size="sm">
                    {i.name}, Please contact the reception for obtaining your walk-in token number for {i.docName}</Heading>
                </VStack>
              ))}

            </VStack >}
            {walkin.length == 0 && !message && resultForPrint.length > 0 ?
              <Heading size="sm">Please wait for your turn</Heading> : null}
          </>
          }

          {
            result.length > 0 && <>
              <Heading size="md">Select the patient(s) that have arrived at the clinic</Heading>
              <VStack spacing={2} p={3} alignItems={"baseline"}>
                {result.map((item) => <Checkbox value={item?.patientID}
                  // defaultChecked={result.length == 1}
                  isChecked={checked.includes(item.patientID)}
                  onChange={handleChange} colorScheme="blue" borderColor={"gray"}>
                  {item?.status == "delayed" ? `${item?.name} (${item?.status})` : item.name}
                </Checkbox>)}
              </VStack>
              <Button onClick={goBack} isDisabled={checked.length == 0}
                colorScheme="blue" isLoading={isLoading}>Back</Button>
              <Button onClick={arrivedQR} isDisabled={checked.length == 0} isLoading={isLoading}
                colorScheme="blue">Next</Button>
            </>
          }

          {/* <div style={{ display: "none" }}> <QRTokenPrint ref={componentRef} list={resultForPrint} />
      </div> */}
        </>
      }
    </>
  )

}