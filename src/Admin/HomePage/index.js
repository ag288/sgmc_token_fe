import {
  Box,
  Circle,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../../api';
import { css } from '@emotion/react';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { RescheduleReviews } from '../../ReviewBooking/PendingReviews';
import { MorningList } from './MorningList';
import { FaBell, FaEllipsisV } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { logout } from '../../utils/tokenFunctions';
import { FullPageSpinner } from '../../utils/spinner';
import { ExportToExcel } from './ExportToExcel';
import { WalkInList } from './WalkInList';
import { BellWithBadge } from '../../components/BellWithBadge';

// List of staff profiles pending approval

export const PatientList = (props) => {

  const { user, setUser } = useContext(AppContext)
  const [current, setCurrent] = useState(0)
  const [mornlist, setMornList] = useState([])
  const [aftlist, setAftList] = useState([])
  const [walklist, setWalkList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState("")

  useEffect(() => {

    setInterval(() => {
      if (window.location.pathname == "/" || window.location.pathname == "/home")
        window.location.reload()
    }, 300000)


    let flag = 0


    api.token.fetchMorningList().then((res) => {
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
      setData(response[2].length)
    })

    // api.token.fetchAfternoonList().then((res) => {
    //   const response = JSON.parse(res.data).result
    //   for (var i = 0; i < response.length; i++)
    //     if (response[i].status == "current") {
    //       setCurrent(response[i])
    //     }
    //   setAftList(response)

    // })

    api.token.fetchWalkInList().then((res) => {
      const response = JSON.parse(res.data).result
      for (var i = 0; i < response.length; i++)
        if (response[i].status == "current") {
          setCurrent(response[i])
        }
      setWalkList(response)

    })


  }, []);


  let navigate = useNavigate()

  function viewPendingReviews() {
    navigate("/pending-reviews")
  }

  return (
    <>

      <Flex
        minH={'100vh'}
        overflow={"scroll"}
        bg={"gray.100"}>
        {isLoading ? <FullPageSpinner /> :
          <Stack spacing="2%" mx={"auto"} py={3} px={3} width={'full'}>
            <HStack>
              <Box>
                <Menu m="2%" closeOnBlur={true}>
                  <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                  <MenuList color={"black"}>
                    <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
                    <MenuItem onClick={() => navigate('/book')} >Book daily token</MenuItem>
                    {user.userID == 2 && <MenuItem onClick={() => navigate('/book-review')} >Book a future token</MenuItem>}
                    <MenuItem onClick={() => logout(setUser)} >Logout</MenuItem>
                    {user.userID == 2 && <ExportToExcel />}
                  </MenuList>
                </Menu>
              </Box>
             {user.userID==2 && <BellWithBadge onClick={viewPendingReviews} count={data} />}
            </HStack>
            <CurrentPatient current={current} setCurrent={setCurrent} />
            <MorningList loading={isLoading} setIsLoading={setIsLoading} mornlist={mornlist} current={current} setCurrent={setCurrent} />
            <AfternoonList loading={isLoading} setIsLoading={setIsLoading} aftlist={aftlist} current={current} setCurrent={setCurrent} />
            {/* <WalkInList loading={isLoading} setIsLoading={setIsLoading} walklist={walklist} current={current} setCurrent={setCurrent}/> */}
          </Stack>
        }

      </Flex>
    </>
  )
}
