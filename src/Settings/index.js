import {
    Flex,
    IconButton,
    Stack,
    useMediaQuery,
    Box, Select, Tabs, TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { GeneralSettings } from './GeneralSettings'
import { Holidays } from './Holidays'
import { FaHome } from 'react-icons/fa'
import { TokenTypes } from './TokenTypes'
import { WorkingHourSettings } from './WorkingHourSettings'
import api from '../api'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import { filterDoctor } from '../utils/tokenFunctions'


export const Settings = () => {

    let navigate = useNavigate()
    const { doctor, doctors, setDoctor, user ,index, setIndex} = useContext(AppContext)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    function handleChange(e) {
        setDoctor(e.target.value)
        localStorage.setItem("doctor", e.target.value)
    }
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
                bg={"gray.100"}>
                <Stack mx={'auto'} spacing="2%" px={3} width="full">
                    {/* <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton> */}
                    {/* <Box align='center'>
                        <Select width={isLaptop ? "30%" : "full"} size={"lg"} value={doctor} onChange={handleChange} bg="white">
                        {filterDoctor(doctors, user.userID).map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box> */}
                    <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                        <TabList>
                            {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
                        </TabList>

                        <TabPanels>
                            {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                                <> <WorkingHourSettings doctor={doctor} />
                                    <GeneralSettings doctor={doctor}/>
                                    <Holidays doctor={doctor}/>
                                    <TokenTypes doctor={doctor}/></>
                            </TabPanel>)}
                        </TabPanels>
                    </Tabs>


                </Stack>
            </Flex>
        </>
    )
}
