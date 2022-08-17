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
  Text,Tabs, TabList, TabPanels, Tab, TabPanel 
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
import { filterDoctor, logout } from '../../utils/tokenFunctions';
import { FullPageSpinner } from '../../utils/spinner';
import { ExportToExcel } from './ExportToExcel';
import { WalkInList } from './WalkInList';
import { BellWithBadge, DuplicatePatientsNotif } from '../../components/BellWithBadge';
import { TokenList } from './TokenList';
import { DoctorTabs } from '../../components/DoctorTabs';

// List of staff profiles pending approval

export const PatientList = (props) => {

  const { user, setUser, setDoctor, doctor, doctors,index, setIndex } = useContext(AppContext)
   const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
  // const [current, setCurrent] = useState(0)
  // const [mornlist, setMornList] = useState([])
  // const [aftlist, setAftList] = useState([])
  // const [walklist, setWalkList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
 // const [data, setData] = useState("")

  useEffect(() => {

    setInterval(() => {
      if (window.location.pathname == "/" || window.location.pathname == "/home")
        window.location.reload()
    }, 300000)


    // let flag = 0


    // api.token.fetchMorningList({ doctor }).then((res) => {
    //   const response = JSON.parse(res.data).result

    //   for (var i = 0; i < response[0].length; i++) {
    //     console.log(response[0][i])
    //     if (response[0][i].status == "current") {
    //       setCurrent(response[0][i])
    //       flag = 1
    //       break
    //     }
    //   }
    //   if (flag == 0) {
    //     for (var i = 0; i < response[1].length; i++) {
    //       if (response[1][i].status == "current") {
    //         setCurrent(response[1][i])
    //         break
    //       }
    //     }
    //   }
    //   setMornList(response[0])
    //   setAftList(response[1])
    //   setData(response[2].length)
    // })



  }, [doctor]);



  const colors = ["red", "blue", "yellow", "green", "purple", "cyan", "orange"]
  let navigate = useNavigate()

  function viewPendingReviews() {
    navigate("/pending-reviews")
  }

  function viewDuplicatePatients() {
    navigate("/duplicates")
  }

  // function handleChange(e) {
  //   setDoctor(e.target.value)
  //   localStorage.setItem("doctor", e.target.value)
  // }

  function handleNewChange(index) {
    let docArray=filterDoctor(doctors,user.userID)
    setDoctor(docArray[index].doctorID)
    setIndex(index)
    localStorage.setItem("doctor",doctors[index].doctorID)
    localStorage.setItem("tabIndex",index)
  }

  return (
    <>

      <Flex
        minH={'100vh'}
        overflow={"scroll"}
        width="full"
        bg={"gray.100"}>
        {isLoading ? <FullPageSpinner /> :
          // <Stack spacing="2%" mx={"auto"} py={3} px={3} width={'full'}>
          //   {/* <HStack>
          //     <Box>
          //       <Menu m="2%" closeOnBlur={true}>
          //         <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
          //         <MenuList color={"black"}>
          //           <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
          //           <MenuItem onClick={() => navigate('/book')} >Book daily token</MenuItem>
          //           {user.userID == 2 && <MenuItem onClick={() => navigate('/book-review')} >Book a future token</MenuItem>}
          //           <MenuItem onClick={() => logout(setUser)} >Logout</MenuItem>
          //           {user.userID == 2 && <ExportToExcel doctor={doctor} />}
          //         </MenuList>
          //       </Menu>
          //     </Box>
          //     {user.userID == 2 && <BellWithBadge onClick={viewPendingReviews} count={data} />}
          //     {user.userID == 2 && <DuplicatePatientsNotif onClick={viewDuplicatePatients} count={1} />}
            
          //    </HStack> */}
          //    {/*
          //    {isMobile &&
          //     <>
          //       <Box align='center'>
          //         <Select size={"lg"} value={doctor} onChange={handleChange} width="30%" bg="white">
          //           {filterDoctor(doctors, user.userID).map((doctor) => <option value={doctor.doctorID} >{doctor.name}</option>)}

          //         </Select></Box>
          //       <CurrentPatient current={current} setCurrent={setCurrent} doctor={doctor} />
          //       <MorningList loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} mornlist={mornlist} current={current} setCurrent={setCurrent} />

          //       <AfternoonList loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} aftlist={aftlist} current={current} setCurrent={setCurrent} />
          //      </>} 
          //     */}
          //   {true &&
          //     <>
          //       {/* <Box align ='center'>
          //     <Select size={"lg"} value={doctor} onChange={handleChange} width="30%" bg="white">
          //       {doctors.map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
       
          //     </Select></Box> */}



          //       <Tabs  variant="solid-rounded">
          //         <TabList>
          //           {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
          //         </TabList>

          //         <TabPanels>
          //           {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
          //             <TokenList color={colors[index]} doctor={doctor} />
          //           </TabPanel>)}
          //         </TabPanels>
          //       </Tabs>

          //       {/* <WalkInList loading={isLoading} setIsLoading={setIsLoading} walklist={walklist} current={current} setCurrent={setCurrent} /> */}
          //     </>}
          // </Stack>
          // <Stack spacing="2%" py={3} width={'full'}>
          <Tabs isFitted width="full" overflow={"scroll"} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
          <TabList m={1}>
            {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab width="full">{doctor.name}</Tab>
         : <Tab >{doctor.initials}</Tab>)}
          </TabList>

          <TabPanels>
            {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel width="full">
              <TokenList color={colors[index]} doctor={doctor} />
            </TabPanel>)}
          </TabPanels>
        </Tabs>
// </Stack>
        
        }

      </Flex>
    </>
  )
}
