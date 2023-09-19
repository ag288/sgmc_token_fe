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
  Select,
  useMediaQuery,
  Text, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../../api';
import { css } from '@emotion/react';
import { AfternoonList } from './AfternoonList';
import { CurrentPatient } from './CurrentPatient';
import { RescheduleReviews } from '../../ReviewBooking/PendingReviews';
import { MorningList } from './MorningList';
import { FaBell, FaEllipsisV, FaLaptop, FaMobile, FaMobileAlt, FaPhone, FaPhoneSquare } from 'react-icons/fa'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { filterDoctor, logout } from '../../utils/tokenFunctions';
import { FullPageSpinner } from '../../components/Spinner';
import { TokenList } from './TokenList';
import { ArrivalModal } from './ArrivalModal'

export const PatientList = (props) => {

  const { user, setUser, setDoctor, doctor, doctors, index, setIndex } = useContext(AppContext)
  //let params= useParams()
  const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
  const [isLoading, setIsLoading] = useState(false)
  const [desktopView, setDesktopView] = useState(false)
  const [count, setCount] = useState([])
  const [arrivals, setArrivals] = useState([])
  const [flag, setFlag] = useState(0)
  const { onOpen, onClose, isOpen } = useDisclosure()

  useEffect(() => {

    setInterval(() => {
      if (window.location.pathname == "/" || window.location.pathname == "/home")
        window.location.reload()
    }, 300000)

    api.token.fetchApptCountAndArrival().then((res) => {
      const response = JSON.parse(res.data)
      setCount(response.count)
      if (response.arrival.length > 0) {
        setArrivals(response.arrival)
        onOpen()
      }
    })


  }, []);



  const colors = ["red", "navy", "teal", "green", "purple", "darkmagenta", "darkorange", "salmon", "skyblue"]
  let navigate = useNavigate()

  function viewPendingReviews() {
    navigate("/pending-reviews")
  }

  function viewDuplicatePatients() {
    navigate("/duplicates")
  }


  function handleNewChange(index) {
    let docArray = filterDoctor(doctors, user.userID)
    setDoctor(docArray[index].doctorID)
    setIndex(index)
    localStorage.setItem("doctor", docArray[index].doctorID)
    localStorage.setItem("tabIndex", index)
  }

  return (
    <>

      <Flex
        minH={'100vh'}
        //overflow={"scroll"}
        width="full"
        bg={"gray.100"}>

        {isLoading ? <FullPageSpinner /> :
          <>

            <Tabs display={"flex"} flexDirection={"column"} width="full" defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
              <HStack> <TabList m={1}>
                {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab >
                  {doctor.name}

                  {count?.find(i => i.doctorID == doctor.doctorID)?.count > 0 &&
                    < Circle size='20px' color={'white'} ml={2} fontSize={'0.8rem'}
                      bgColor={'red'} zIndex={3} p={'3px'}>
                      {count?.find(i => i.doctorID == doctor.doctorID)?.count}
                    </Circle>
                  }
                </Tab>
                  : <Tab >{doctor.longInitials}</Tab>)}
              </TabList>
                <IconButton size="lg" bg="transparent" onClick={() => { setDesktopView(!desktopView) }}
                  display={{ base: 'flex', md: 'none' }} icon={desktopView ? <FaMobileAlt /> : <FaLaptop />}></IconButton>
              </HStack>
              <TabPanels>
                {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel width="full">
                  <TokenList desktopView={desktopView} color={colors[index]} doctor={doctor}
                  flag={flag} />
                </TabPanel>)}
              </TabPanels>
            </Tabs>

          </>
        }
        <ArrivalModal list={arrivals} setList={setArrivals} onClose={onClose} isOpen={isOpen} setFlag={setFlag} />
      </Flex>
    </>
  )
}
