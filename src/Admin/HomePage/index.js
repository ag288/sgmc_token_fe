import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../../api';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { MorningList } from './MorningList';
import { FaEllipsisV } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { logout } from '../../utils/tokenFunctions';
import { FullPageSpinner } from '../../utils/spinner';

// List of staff profiles pending approval

export const PatientList = (props) => {

  const {user, setUser} = useContext(AppContext)
  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {

    setInterval(() => {
      if (window.location.pathname == "/" || window.location.pathname == "/home")
        window.location.reload()
    }, 300000)

    api.token.fetchMorningList().then((res) => {
      const response = JSON.parse(res.data).result
      for (var i = 0; i < response.length; i++)
        if (response[i].status == "current") {
          setCurrent(response[i])
        }
      console.log(response)
      setMornList(response)
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

        {isLoading ? <FullPageSpinner/> :
          <Stack spacing="2%" py={3} px={3} width={'auto'}>
            <Box>
              <Menu m="2%" closeOnBlur={true}>
                <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                <MenuList color={"black"}>
                  <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
                  <MenuItem onClick={() => navigate('/book')} >Book daily token</MenuItem>
                  <MenuItem onClick={()=>logout(setUser)} >Logout</MenuItem>
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
