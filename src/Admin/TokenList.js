import { Box, Button, Divider, Heading, HStack, IconButton, Stack, Switch, Text, useDisclosure, useMediaQuery } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaLaptop } from "react-icons/fa"
import api from "../api"
import { AppContext } from "../App"
import { AfternoonList } from "./AfternoonList"
import { CurrentPatient } from "./CurrentPatient"
import { MorningList } from "./MorningList"


export const TokenList = ({ doctor, desktopView }) => {

  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [doctorIn, setDoctorIn] = useState({})
  const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
  const { user } = useContext(AppContext)


  useEffect(() => {

    let flag = 0



    api.token.fetchTokenList({ doctor: doctor.doctorID }).then((res) => {
      const response = JSON.parse(res.data).result
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
    })



  }, [doctor]);


  return (
    <>
      <Stack width={'full'}>
        <Heading mb={3} align="center" size={"lg"}>{doctor?.name}</Heading>
      
        <CurrentPatient current={current} />

        <MorningList desktopView={desktopView} doctor={doctor.doctorID} mornlist={mornlist} current={current} setCurrent={setCurrent} />

        <AfternoonList desktopView={desktopView} doctor={doctor.doctorID} aftlist={aftlist} current={current} setCurrent={setCurrent} />
      </Stack>
    </>
  )
}