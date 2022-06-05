import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Flex,
    Stack,
    HStack,
    Tooltip,
    useDisclosure,
    IconButton,
    Text,
    Heading,
    Checkbox,
    filter
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { CurrentPatient } from './CurrentPatient';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const MorningList = ({ current, setCurrent }) => {

    const [mornlist, setMornList] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)

    useEffect(() => {

        api.token.fetchMorningList().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setMornList(response)
           // setCurrent(response[0].tokenNumber)
        })

    }, []);

    function handleChange(){
        setShowCompleted(!showCompleted)
    }

    function filterList(list) {
        return list.filter(item => {
            if (item.status != "cancelled") {
                if (item.status == "completed" && showCompleted) {
                    return true
                }
                else if (item.status == "completed" && !showCompleted) {
                    return false
                }
                else return true
            }
        })
    }

    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Morning</Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show completed</Checkbox>
            </HStack>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}
                width='full'>
                <TableContainer>
                    <Table variant='striped' colorScheme='grey'>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>
                                    Token No.
                                </Th>
                                <Th> Name               </Th>
                                <Th>File No.</Th>
                                <Th>Type</Th>
                                <Th>In</Th>
                                <Th>Out</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filterList(mornlist).map((item) =>
                                <Tr bg={item.tokenNumber == current?.split("-")[1] && item.slot==current?.split("-")[0]? "green.100" :
                                    (item.status == "completed" ? "gray.200" : "white")}>
                                    <Td><ButtonPopover current={current} setCurrent={setCurrent} item={item} /></Td>
                                    <Td >{`${item.slot}-${item.tokenNumber}`}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.fileNumber}</Td>
                                    <Td>{item.type}</Td>
                                    <Td>hi</Td>
                                    <Td></Td>
                                </Tr>
                            )
                            }


                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

        </>
    )
}
