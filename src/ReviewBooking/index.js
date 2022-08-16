import { Flex, HStack, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaHome, FaList } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../api"
import userApi from "../api/user"
import { AppContext } from "../App"
import { PatientDetails } from "../components/PatientDetails"
import { filterDoctor } from "../utils/tokenFunctions"


export const ReviewBooking = () => {

    let navigate = useNavigate()

    const { user, doctor, doctors, setDoctor, index, setIndex } = useContext(AppContext)
    useEffect(() => {

    }, [])

    return (
        <Flex
            minH={'100vh'}
            bg={"gray.100"}>
            <HStack spacing="auto" alignItems={"baseline"}>
                {/* <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton> */}
                {user.userID == 2 ? <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaList />} onClick={() => navigate('/review-list')}></IconButton>
                    : null}
            </HStack>
            {/* <Tabs m={2} defaultIndex={index} onChange={(index) => {setDoctor(doctors[index].doctorID)
            setIndex(index)}} variant="solid-rounded">
                <TabList>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
                </TabList>

                <TabPanels>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                        <PatientDetails availability={""} navigateTo={"/review-details"} doctor={doctor} />
                    </TabPanel>)}
                </TabPanels>
            </Tabs> */}

<PatientDetails availability={""} navigateTo={"/review-details"}/>
        </Flex>
    )
}