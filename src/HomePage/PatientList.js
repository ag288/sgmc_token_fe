import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Stack,
  HStack,
  Tooltip,
  useDisclosure,
  IconButton,
  Text,
  Heading,
  Checkbox
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { MorningList } from './MorningList';


// List of staff profiles pending approval

export const PatientList = () => {

  const [current, setCurrent] = useState("")
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])

  useEffect(() => {

    let flag=false
    api.token.fetchMorningList().then((res) => {
      const response = JSON.parse(res.data).result
     for(var i=0;i<response.length;i++)
     if(response[i].status=="current"){
      setCurrent(response[i])
         }
      setMornList(response)
     // setCurrent(response[0].tokenNumber)
  })

  api.token.fetchAfternoonList().then((res) => {
    const response = JSON.parse(res.data).result
   for(var i=0;i<response.length;i++)
   if(response[i].status=="current"){
    setCurrent(response[i])
       }
    setAftList(response)
})

  }, []);




  return (
    <>

      <Flex
        minH={'100vh'}
        bg={"gray.100"}>
        <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'full'}>
          <CurrentPatient current={current} setCurrent={setCurrent} />
          <MorningList mornlist={mornlist} current={current} setCurrent={setCurrent} />
          <AfternoonList aftlist={aftlist} current={current} setCurrent={setCurrent} />
        </Stack>
      </Flex>
    </>
  )
}
