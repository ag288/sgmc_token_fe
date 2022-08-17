import { ArrowForwardIcon, ExternalLinkIcon, HamburgerIcon, } from "@chakra-ui/icons";
import { Box, Heading, Text, useMediaQuery, HStack, VStack, IconButton, Table, Thead, Tr, Th, Tbody, Td, Button, Stack, Flex, Icon, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AppContext } from "../App";
import { filterDoctor } from "../utils/tokenFunctions";


export const PendingReviews = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
    const navigate = useNavigate()
    const { doctor, setDoctor, doctors, user, index, setIndex } = useContext(AppContext)
    useEffect(() => {

        api.review.fetchRescheduleReviewList({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReviewList(response)
        })

    }, [doctor]);

    function handleClick(item) {
        setDoctor(item.doctorID)
        localStorage.setItem("doctor", item.doctorID)
        navigate("/book", { state: { item } })
    }

    function handleNewChange(index) {
        let docArray=filterDoctor(doctors,user.userID)
        setDoctor(docArray[index].doctorID)
        setIndex(index)
        localStorage.setItem("doctor",doctors[index].doctorID)
        localStorage.setItem("tabIndex",index)
      }

    return (

        <Flex
            minH={'100vh'}
            overflow={"scroll"}
            bg={"gray.100"}>
            <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                <TabList>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
                </TabList>

                {/* <IconButton icon={<FaHome />} onClick={() => navigate("/home")}></IconButton> */}
                <Stack spacing="2%" mx={"auto"} py={3} px={3} width={'full'}>



                    <TabPanels>
                        {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                width={"auto"}
                                bg={'white'}
                                mx="auto"
                                boxShadow={'2xl'}
                                padding={0}>
                                {reviewlist.length == 0 ? <Heading size="md" p={6}>No pending reviews today</Heading>
                                    : <>
                                        <Heading size={"sm"} p={4}>The following reviews were not generated:</Heading>

                                        <Table variant='striped' colorScheme='grey' size={isLaptop ? "md" : "sm"}>
                                            <Thead>
                                                <Tr>
                                                    <Th>Name</Th>
                                                    <Th>Phone</Th>
                                                    <Th>Type</Th>
                                                    <Th>Est. Time</Th>
                                                    <Th></Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {reviewlist.map((item, index) =>
                                                    <Tr key={index}>
                                                        <Td >{item.name}</Td>
                                                        <Td ><Text href={`tel:+${item.phone}`} as="a" bg="transparent" >{item.phone.substring(2)}</Text>
                                                        </Td>
                                                        <Td>{types[item.type]}</Td>
                                                        <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}</Td>
                                                        <Td>
                                                            {isLaptop && <Button onClick={() => handleClick(item)}>Book Token</Button>}
                                                            {isMobile && <ExternalLinkIcon onClick={() => handleClick(item)} />}
                                                        </Td>
                                                    </Tr>
                                                )
                                                }
                                            </Tbody>
                                        </Table></>}</Box>
                        </TabPanel>)}
                    </TabPanels>


                </Stack>
            </Tabs>
        </Flex>
    )
}