import { Box, Button, Divider, Heading, HStack, IconButton, Stack, Switch, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaLaptop } from "react-icons/fa"
import api from "../../api"
import { AppContext } from "../../App"
import { AfternoonList } from "./AfternoonList"
import { CurrentPatient } from "./CurrentPatient"
import { MorningList } from "./MorningList"


export const TokenList = ({ doctor, color, desktopView }) => {

  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [doctorIn, setDoctorIn] = useState({})
  const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
  const [next, setNext] = useState("")
  const { user } = useContext(AppContext)

  useEffect(() => {

    let flag = 0

    api.settings.fetchSettings({ doctor: doctor.doctorID }).then((res) => {
      const response = JSON.parse(res.data).result
      setDoctorIn({doctor_in:response[0].doctor_in, autocall:response[0].autocall})
    })

    api.token.fetchTokenList({ doctor: doctor.doctorID }).then((res) => {
      const response = JSON.parse(res.data).result
      const nextToken = JSON.parse(res.data).next ? JSON.parse(res.data).next.tokenID : null
      console.log(nextToken)
      for (var i = 0; i < response[0].length; i++) {
        if (response[0][i].status == "current") {
          setCurrent(response[0][i])
          flag = 1
          break
        }
      }
      if (flag == 0) {
        for (var i = 0; i < response[1].length; i++) {
          if (response[1][i].status == "current") {
            setCurrent(response[1][i])
            break
          }
        }
      }

      setMornList(response[0])
      setAftList(response[1])
      setNext(nextToken)
    })



  }, [doctor]);

  function handleChange(e) {
    setDoctorIn(prev=>({...prev, "doctor_in":e.target.checked}))
    
    api.settings.updateDoctorIn({ doctor_in: e.target.checked, doctor: doctor.doctorID }).then((res) => {
      window.location.reload()
    })
  }
  
  function handleAutocallChange(e) {
    setDoctorIn(prev=>({...prev, "autocall":e.target.checked}))
    api.settings.updateAutocall({ autocall: e.target.checked, doctor: doctor.doctorID }).then((res) => {
      window.location.reload()
    })
  }
  return (
    <>
      <Stack width={'full'}>
        {isLaptop && <Heading mb={3} align="center" size={"lg"}>{doctor?.name}</Heading>}
        {user.userID == 2 && <HStack spacing="auto">
          <HStack alignItems={"baseline"}>
            <Text fontSize="md" fontWeight={"bold"}>Doctor is</Text>
            <Text fontWeight={"bold"} >OUT</Text>
            <Switch onChange={handleChange} isChecked={doctorIn.doctor_in}></Switch>
            <Text fontWeight={"bold"} >IN</Text>
          </HStack>
          {/* <HStack alignItems={"baseline"}>
            <Text fontWeight={"bold"} >Autocall</Text>
            <Switch onChange={handleAutocallChange} isChecked={doctorIn.autocall}></Switch>
          </HStack> */}
        </HStack>}
        <CurrentPatient loading={isLoading} setIsLoading={setIsLoading} doctor={doctor.doctorID} current={current} setCurrent={setCurrent} />

        <MorningList desktopView={desktopView} next={next} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor.doctorID} mornlist={mornlist} current={current} setCurrent={setCurrent} />

        <AfternoonList desktopView={desktopView} next={next} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor.doctorID} aftlist={aftlist} current={current} setCurrent={setCurrent} />
      </Stack>
    </>
  )
}