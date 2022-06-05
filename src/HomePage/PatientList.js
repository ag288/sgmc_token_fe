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
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { MorningList } from './MorningList';


// List of staff profiles pending approval

export const PatientList = () => {

  const [current, setCurrent] = useState(localStorage.getItem("current"))
  

  useEffect(() => {

 

  }, []);


  

  return (
      <>
      
          <Flex
              minH={'100vh'}
              bg={"gray.100"}>
              <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'full'}>
              <CurrentPatient current={current} setCurrent={setCurrent}/>
             <MorningList current={current} setCurrent={setCurrent}/>
             <AfternoonList current={current} setCurrent={setCurrent}/>
              </Stack>
          </Flex>
      </>
  )
}
