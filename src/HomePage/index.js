import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { MorningList } from './MorningList';
import { FaEllipsisV } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

// List of staff profiles pending approval

export const PatientList = () => {

  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [state, setState] = useState(0)

  useEffect(() => {

    api.token.fetchMorningList().then((res) => {
      const response = JSON.parse(res.data).result
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
        bg={"gray.100"}>
        <Box>
          <Menu m="2%" closeOnBlur={true}>
            <MenuButton as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
            <MenuList color={"black"}>
              <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
              <MenuItem onClick={() => navigate('/book')} >Book a token</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'full'}>
          <CurrentPatient current={current} setCurrent={setCurrent} />
          <MorningList mornlist={mornlist} current={current} setCurrent={setCurrent} />
          <AfternoonList aftlist={aftlist} current={current} setCurrent={setCurrent} />
        </Stack>
      </Flex>
    </>
  )
}
