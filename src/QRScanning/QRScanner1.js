import React, { Component, useRef, useState } from 'react'
import QrReader from 'react-qr-scanner'
import { VStack, Button, CheckboxGroup, Checkbox, Text, useToast, Box, Heading } from '@chakra-ui/react'
import api from '../api'
import useSound from "use-sound"
import beep from '../Audio/short_beep.wav'
import ReactToPrint from 'react-to-print'
import { ComponentToPrint } from '../Admin/HomePage/TokenPrint'
import { QRTokenPrint } from './QRTokenPrint'

export const QRScanner = () => {

  const [result, setResult] = useState([])
  const [resultForPrint, setResultForPrint] = useState([])
  const [activate, setActivate] = useState(false)
  const [checked, setChecked] = useState([])
  const [message, setMessage] = useState("")

  const toast = useToast()

  const [playActive] = useSound(beep, { volume: 0.5 });
  let componentRef = useRef()
  let count = 0
  function handleScan(data) {
    //console.log(data)
    if (data) {
      count += 1
      if (count == 1)
        playActive()
      let info = data?.text.split("-")
      api.token.scanQr({ tokenID: info[0], phone: info[1] }).then((res) => {

        const response = JSON.parse(res.data)
        if (response.result) {
          setResult(response.result[1])
          setResultForPrint(response.result[2])
          if (response.result[1].length == 1)
            setChecked([response.result[1][0].patientID])
          setActivate(false)
        }
        else if (response.message) {
          setMessage(response.message)
          setActivate(false)
        }

        setTimeout(() => {
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
      const response=JSON.parse(res.data)
      if(response.success){
      toast({
        title: 'Thank You',
        description: "Please wait for your turn",
        position: "top",
        status: 'success',
        duration: 3000,
        isClosable: false,
      })
    }
    else if(response.delayed){
      setMessage(response.delayed)
    }
      setActivate(false)

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
        < QrReader
          delay={100}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan} />
        : <Button onClick={ActivateQR} width={"fit-content"} mb={10} colorScheme={"blue"}>Tap to Scan QR Code</Button >}
      {result.length == 0 ? (message ? <Box m={5} bg="white" rounded="lg" p={3}><Heading size="md">{message}</Heading></Box> : null) : <>
        <Heading size="md">Select the patient(s) that have arrived at the clinic</Heading>

        <VStack spacing={2} p={3} alignItems={"baseline"}>
          {result.map((item) => <Checkbox value={item?.patientID} defaultChecked={result.length == 1} onChange={handleChange} colorScheme="blue" borderColor={"gray"}>{item?.name}</Checkbox>)}
        </VStack>
        {/* <Button onClick={arrivedQR} isDisabled={checked.length == 0} colorScheme="blue">Done</Button> */}
        <>
          <ReactToPrint
            onAfterPrint={arrivedQR}
            trigger={() => <Button isDisabled={checked.length == 0} colorScheme="blue">Done</Button>}
            content={() => componentRef.current} />
          <div style={{ display: "none" }}>  <QRTokenPrint ref={componentRef} list={resultForPrint.filter((item)=>checked.includes(item.patientID))} />
          </div></>
      </>}
    </>
  )

}