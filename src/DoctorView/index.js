
import React, { useContext, useEffect, useState } from "react";
import {
    Flex,
    Box,
    HStack,
    Stack,
    Text,
    Heading,
    Image,
    Table,
    TableContainer,
    Th,
    Td,
    Tbody,
    Thead,
    Tr

} from '@chakra-ui/react';
import { AppContext } from "../App";
import api from "../api";


export const DoctorView = (props) => {
    const { doctor, doctors } = useContext(AppContext)
    const [mornlist, setMornList] = useState([])
    const [aftlist, setAftList] = useState([])
    console.log(doctors)

    useEffect(() => {


        api.token.fetchTokenListForPrint({ doctor: doctor }).then((res) => {
            const response = JSON.parse(res.data).result

            console.log(response)
            setMornList(response[0])
            setAftList(response[1])
        })



    }, [doctor]);

    return (
        <Flex
            minH={'100vh'}
            justify="center"
            width="full"
            bg="gray.100">
                   <Box
                    rounded={'lg'}
                  //  bg={'white'}
                    boxShadow={'lg'}
                    p={3}
                    width='full'>
            <Stack bg="white" spacing={5} p={10}>
             
                    <Heading size={"sm"}>Morning</Heading>

                    <TableContainer>
                        <Table variant='striped'>
                            <Thead>
                                <Tr>
                                    <Th>Token</Th>
                                    <Th>Name</Th>
                                    <Th>File No.</Th>
                                    <Th>Type</Th>
                                    <Th>Phone</Th>
                                    <Th >Token Time</Th>
                                    <Th>In</Th>
                                    <Th>Out</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {mornlist.map((item, index) =>
                                    <Tr key={index}>
                                        <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
                                        <Td>{item.name}</Td>

                                        <Td><Text>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                        </Td>
                                        <Td> {item.type}</Td>
                                        <Td>{item.phone.substring(2)}</Td>
                                        <Td>
                                            <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                                                .toLocaleTimeString('en-US',
                                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                            </Text>
                                        </Td>
                                        <Td>{item.timeIn &&
                                            <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                                .toLocaleTimeString('en-US',
                                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                            </Text>
                                        }</Td>
                                        <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                            .toLocaleTimeString('en-US',
                                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                        </Td>

                                    </Tr>)
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>

                    <Heading size={"sm"}>Afternoon</Heading>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Token</Th>
                                    <Th>Name</Th>
                                    <Th>File No.</Th>
                                    <Th>Type</Th>
                                    <Th>Phone</Th>
                                    <Th >Token Time</Th>
                                    <Th>In</Th>
                                    <Th>Out</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {aftlist.map((item, index) =>
                                    <Tr key={index}>
                                        <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
                                        <Td>{item.name}</Td>

                                        <Td><Text>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                        </Td>
                                        <Td> {item.type}</Td>
                                        <Td>{item.phone.substring(2)}</Td>
                                        <Td>
                                            <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                                                .toLocaleTimeString('en-US',
                                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                            </Text>
                                        </Td>
                                        <Td>{item.timeIn &&
                                            <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                                .toLocaleTimeString('en-US',
                                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                            </Text>
                                        }</Td>
                                        <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                            .toLocaleTimeString('en-US',
                                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                        </Td>

                                    </Tr>)
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
              
            </Stack>
            </Box>
        </Flex>
    );
};
