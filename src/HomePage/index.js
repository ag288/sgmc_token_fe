import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../api';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { MorningList } from './MorningList';
import { FaEllipsisV } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

// List of staff profiles pending approval

export const PatientList = () => {

  const user = useContext(AppContext)
  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [state, setState] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    api.token.fetchMorningList().then((res) => {
      const response = JSON.parse(res.data).result
      console.log(response)
      for (var i = 0; i < response.length; i++)
        if (response[i].status == "current") {
          setCurrent(response[i])
        }
      setMornList(response)
      // setCurrent(response[0].tokenNumber)
    })

    api.token.fetchAfternoonList().then((res) => {
      const response = JSON.parse(res.data).result
      for (var i = 0; i < response.length; i++)
        if (response[i].status == "current") {
          setCurrent(response[i])
        }
      setAftList(response)
    })

  }, []);

  let navigate = useNavigate()


  return (
    <>

      <Flex
        minH={'100vh'}
        width='100%'
        height="full"
        overflow={"scroll"}
        bg={"gray.100"}>

        {isLoading ? <Box width="full" alignItems={"center"} height="full"> <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size="xl"
          ml={"40%"}
          mt="20%"
        /> </Box> :
          <Stack spacing="2%" py={3} px={3} width={'50%'}>
            <Box>
              <Menu m="2%" closeOnBlur={true}>
                <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                <MenuList color={"black"}>
                  <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
                  <MenuItem onClick={() => navigate('/book')} >Book a token</MenuItem>
                  <MenuItem onClick={() => user.setUser(null)} >Logout</MenuItem>
                </MenuList>
              </Menu>
            </Box>

            <CurrentPatient current={current} setCurrent={setCurrent} />
            <MorningList loading={isLoading} setIsLoading={setIsLoading} mornlist={mornlist} current={current} setCurrent={setCurrent} />
            <AfternoonList loading={isLoading} setIsLoading={setIsLoading} aftlist={aftlist} current={current} setCurrent={setCurrent} />
          </Stack>
        }

      </Flex>
    </>
  )
}
