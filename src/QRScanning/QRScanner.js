import React, { Component, useRef, useState } from 'react'
import QrReader from 'react-qr-scanner'
import { VStack, Button, CheckboxGroup, Checkbox, Text, useToast, Box, Heading } from '@chakra-ui/react'
import api from '../api'
import useSound from "use-sound"
import beep from '../Audio/short_beep.wav'
import ReactToPrint, { useReactToPrint } from 'react-to-print'
import { ComponentToPrint } from '../Admin/HomePage/TokenPrint'
import { QRTokenPrint } from './QRTokenPrint'
import { useEffect } from 'react'

export const QRScanner = () => {

  const [result, setResult] = useState([])
  const [resultForPrint, setResultForPrint] = useState()
  const [activate, setActivate] = useState(false)
  const [checked, setChecked] = useState([])
  const [message, setMessage] = useState("")
  let componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    //onAfterPrint: () => arrivedQR
  })

  const toast = useToast()

  const [playActive] = useSound(beep, { volume: 0.5 });

  let count = 0

  useEffect(() => {
    if (resultForPrint) {
      console.log(resultForPrint)
      handlePrint()
    }
    setResultForPrint()
  }, [resultForPrint])

  function handleScan(data) {
    //console.log(data)
    if (data && count == 0) {
      setActivate(false)
      count += 1
      if (count == 1)
        playActive()
      let info = data?.text.split("-")
      api.token.scanQr({ tokenID: info[0], phone: info[1] }).then((res) => {
        setActivate(false)
        const response = JSON.parse(res.data)
        if (response.onlyOne) {
          if (response.onlyOne.arrived) {
            setResultForPrint(response.onlyOne.arrived)
            toast({
              title: 'Thank You',
              description: "Please wait for your turn",
              position: "top",
              status: 'success',
              duration: 3000,
              isClosable: false,
            })
          }
          if (response.onlyOne.delayed) {
            setMessage(response.onlyOne.delayed)
          }
          setActivate(false)
        }
        else {
          if (response.result) {
            setResult(response.result[1])
          }
          if (response.message) {
            setMessage(response.message)
            setActivate(false)
          }
        }
        setTimeout(() => {
          console.log("in timeout")
          setResult([])
          setMessage("")
        }, 120000)
      })
    }
  }

  function arrivedQR() {
    api.token.arrivedQR({ item: checked }).then((res) => {
      setResult([])
      setChecked([])
      const response = JSON.parse(res.data)
      if (response.arrived) {
        setResultForPrint(response.arrived)
        toast({
          title: 'Thank You',
          description: "Please wait for your turn",
          position: "top",
          status: 'success',
          duration: 3000,
          isClosable: false,
        })
      }
      if (response.delayed) {
        setMessage(response.delayed)
      }
      setActivate(false)
      setTimeout(() => {
        setMessage("")
      }, 120000)
    })
  }

  function handleError(err) {
    console.error(err)
  }

  const previewStyle = {
    height: 240,
    width: 320,
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

  return (
    <>

      {activate ?
        <>
          {/* <Button onClick={ActivateQR} width={"fit-content"} mb={10} colorScheme={"blue"}>Tap to Scan QR Code</Button > */}
          < QrReader
            delay={100}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan} /></>

        : <Button onClick={ActivateQR} width={"fit-content"} mb={10} colorScheme={"blue"}>Tap to Scan QR Code</Button >}
      {result.length == 0 ? (message ? <Box m={5} bg="white" rounded="lg" p={3}><Heading size="md">{message}</Heading></Box> : null) :
        <>
          <Heading size="md">Select the patient(s) that have arrived at the clinic</Heading>
          <VStack spacing={2} p={3} alignItems={"baseline"}>
            {result.map((item) => <Checkbox value={item?.patientID} defaultChecked={result.length == 1}
              onChange={handleChange} colorScheme="blue" borderColor={"gray"}>
              {item?.status == "delayed" ? `${item?.name} (${item?.status})` : item.name}
            </Checkbox>)}
          </VStack>
          <Button onClick={arrivedQR} isDisabled={checked.length == 0} colorScheme="blue">Done</Button>
          {/* <ReactToPrint
              onAfterPrint={arrivedQR}
              trigger={() => <Button isDisabled={checked.length == 0} colorScheme="blue">Done</Button>}
              content={() => componentRef.current} /> */}

        </>}
      <div style={{ display: "none" }}> <QRTokenPrint ref={componentRef} list={resultForPrint} />
      </div>
    </>
  )

}