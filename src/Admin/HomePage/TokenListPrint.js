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
import { TokenList } from "./TokenList";
import api from "../../api";
import { AppContext } from "../../App";
import { filterList } from "../../utils/tokenFunctions";


export const TokenListPrint = React.forwardRef((props, ref) => {

let name = (props.doctors)?.find((doc)=>doc.doctorID==props.doctor)?.name   

    return (
        <Flex ref={ref}>
            <Stack p={10}>
                <Heading align={"center"}>{name}</Heading>
                <Heading size={"sm"}>{props.timeOfDay}</Heading>
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
                            {props.list.map((item, index) =>
                                <Tr key={index}>
                                    <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
                                    <Td>{item.name}</Td>

                                    <Td><Text>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                    </Td>
                                    <Td> {item.type}</Td>
                                    <Td>{item.phone?.substring(2)}</Td>
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

                {/* <Heading size={"sm"}>Afternoon</Heading>
                <TableContainer>
                    <Table variant={"striped"}>
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
                            {props.aftlist.map((item, index) =>
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
                </TableContainer> */}
            </Stack>
        </Flex>
    );
});
