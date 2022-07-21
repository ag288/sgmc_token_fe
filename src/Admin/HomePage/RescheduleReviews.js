import { HamburgerIcon, } from "@chakra-ui/icons";
import { Box, Heading, Text, useMediaQuery ,HStack, VStack, IconButton, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import api from "../../api";


export const RescheduleReviews = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])

    useEffect(() => {

        api.review.fetchRescheduleReviewList().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReviewList(response)
        })

    }, []);


    return (
        reviewlist.length==0 ? null :
        <VStack>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                width={"full"}
                bg={'white'}
                mx="auto"
                boxShadow={'2xl'}
                padding={4}>
                   
                            <Heading size={"sm"} mb={2}>The following reviews were not generated:</Heading>
                           
                        <Table variant='striped' colorScheme='grey'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Phone</Th>
                                    <Th>Date</Th>
                                    <Th>Token</Th>
                                    <Th>Type</Th>
                                    <Th>Est. Time</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {reviewlist.map((item, index) =>
                                    <Tr key={index}>
                                        <Td >{item.name}</Td>
                                        <Td ><Text href={`tel:+${item.phone}`} as="a" bg="transparent" >{item.phone.substring(2)}</Text>
                                        </Td>
                                        <Td >{new Date(item.date).toDateString()}</Td>
                                        <Td >{item.tokenNumber}</Td>
                                        <Td>{item.type}</Td>
                                        <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}</Td>
                                         </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                    
            </Box>
        </VStack>
    )
}