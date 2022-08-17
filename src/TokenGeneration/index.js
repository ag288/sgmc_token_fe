import { Flex, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaHome } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { AppContext } from "../App"
import { PatientDetails } from "../components/PatientDetails"
import { filterDoctor } from "../utils/tokenFunctions"


export const TokenGeneration = () => {

    const [availability, setAvailability] = useState("")
    const { doctor, setDoctor, doctors, user, index, setIndex } = useContext(AppContext)
    let navigate = useNavigate()

    useEffect(() => {
console.log(doctor)
        api.settings.checkAvailability({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setAvailability(response)
        })

    }, [doctor])
    return (
        <Flex
            minH={'100vh'}

            bg={"gray.100"}>

            {/* <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
            */}
            {/* <Tabs m={2} defaultIndex={index} onChange={(index) => {
                setDoctor(doctors[index].doctorID)
                setIndex(index)
            }} variant="solid-rounded">
                <TabList>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
                </TabList>

                <TabPanels>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                      
                    </TabPanel>)}
                </TabPanels>
            </Tabs> */}
            <PatientDetails availability={availability} navigateTo={"/token-details"} />
        </Flex>
    )
}