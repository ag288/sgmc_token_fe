import { Box, Divider, Heading, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import api from "../../api"
import { AfternoonList } from "./AfternoonList"
import { CurrentPatient } from "./CurrentPatient"
import { MorningList } from "./MorningList"


export const TokenList = ({doctor,color}) =>{

  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  //const [data, setData] = useState("")

    useEffect(() => {

        let flag = 0
    
    
        api.token.fetchTokenList({doctor: doctor.doctorID}).then((res) => {
          const response = JSON.parse(res.data).result
    
          for (var i = 0; i < response[0].length; i++) {
            console.log(response[0][i])
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
        //  setData(response[2].length)
        })
 
    
    
      }, [doctor]);

    return (
      <>
       <Stack width={'full'}>
        <Heading mb={3} align="center" size={"lg"}>{doctor?.name}</Heading>
      <CurrentPatient current={current} setCurrent={setCurrent} />
      <MorningList loading={isLoading} setIsLoading={setIsLoading} doctor={doctor.doctorID} mornlist={mornlist} current={current} setCurrent={setCurrent} />

      <AfternoonList loading={isLoading} setIsLoading={setIsLoading} doctor={doctor.doctorID} aftlist={aftlist} current={current} setCurrent={setCurrent} />
      </Stack> 
      </>
    )
}