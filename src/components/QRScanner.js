import React, { Component, useState } from 'react'
import QrReader from 'react-qr-scanner'
import { VStack, Button, CheckboxGroup, Checkbox, Text } from '@chakra-ui/react'
import api from '../api'

// export class QRScanner extends Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       delay: 100,
//       result: 'No result',
//     }

//     this.handleScan = this.handleScan.bind(this)
//   }
//   handleScan(data){
//     let [tokenID, phone] = data.text.split("-")
//    api.token.scanQr({tokenID, phone}).then((res)=>{

//    })
//     this.setState({
//       result: data,
//     })
//   }
//   handleError(err){
//     console.error(err)
//   }
//   render(){
//     const previewStyle = {
//       height: 240,
//       width: 320,
//     }

//     return(
//       <div>
//         <QrReader
//           delay={this.state.delay}
//           style={previewStyle}
//           onError={this.handleError}
//           onScan={this.handleScan}
//           chooseDeviceId={()=>{
// console.log("hi")
//           }}
//           />
//         <p>{this.state.result?.text}</p>
//       </div>
//     )
//   }
// }




export const QRScanner = () => {

  const [result, setResult] = useState([])
  const [activate, setActivate] = useState(false)
  const [checked, setChecked] = useState([])

  function handleScan(data) {
    //console.log(data)
    if (data) {
      console.log(data)
      let info = data?.text.split("-")
      api.token.scanQr({ tokenID: info[0], phone: info[1] }).then((res) => {
        const response = JSON.parse(res.data)
        if (response.result) {
          setResult(response.result)
        }
        else if (response.success) {
          setResult([])
          setChecked([])
          setActivate(false)

        }
        else if (response.message) {

        }
      })
    }
  }

  function arrivedQR() {
    api.token.arrivedQR({ item: checked }).then((res) => {
      setResult([])
      setChecked([])
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

  function activateQR() {
    setActivate(true)
  }

  function handleChange(e) {
    setChecked(prev => ([...prev, e.target.value]))
  }

  return (

    activate ? <>
      < QrReader
        delay={100}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan} />
      <Text>Select the patient(s) that have arrived at the clinic</Text>

      <VStack>
        {result.map((item) => <Checkbox value={item?.patientID} onChange={handleChange} colorScheme="blue" borderColor={"gray"}>{item?.name}</Checkbox>)}
      </VStack>
      <Button onClick={arrivedQR} colorScheme="blue">Done</Button>
    </>
      : <Button onClick={activateQR} colorScheme={"blue"}>Tap to Activate</Button >

  )

}