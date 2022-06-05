import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons';
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
    Checkbox
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { CurrentPatient } from './CurrentPatient';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const AfternoonList = ({ current, setCurrent }) => {

    const [hideAfternoon, setHideAfternoon] = useState(new Date() > new Date("14:00") ? false : true)
    const [showCompleted, setShowCompleted] = useState(false)
    const [aftlist, setAftList] = useState([])


    useEffect(() => {

        api.token.fetchAfternoonList().then((res) => {
            const response = JSON.parse(res.data).result
            setAftList(response)
        })

    }, []);


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

    function handleChange() {
        setShowCompleted(!showCompleted)
    }


    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Afternoon {hideAfternoon ? <ChevronDownIcon onClick={() => setHideAfternoon(false)} /> : <ChevronUpIcon onClick={() => setHideAfternoon(true)} />} </Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show completed</Checkbox>
            </HStack>
            {hideAfternoon ? null :
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
                                {filterList(aftlist).map((item) =>
                                    <Tr bg={item.tokenNumber == current ? "green.100" :
                                        (item.status == "completed" ? "gray.200" : "white")}>
                                        <Td><ButtonPopover current={current} setCurrent={setCurrent} item={item} /></Td>
                                        <Td >{item.tokenNumber}</Td>
                                        <Td>{item.name}</Td>
                                        <Td>{item.fileNumber}</Td>
                                        <Td>{item.reason}</Td>
                                        <Td>hi</Td>
                                        <Td></Td>
                                    </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>}

        </>

    )
}
