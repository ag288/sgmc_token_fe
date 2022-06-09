import { CheckIcon, EditIcon } from '@chakra-ui/icons';
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
    filter,
    EditablePreview,
    Editable,
    EditableInput,
    Input
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { CurrentPatient } from './CurrentPatient';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const MorningList = ({ mornlist, current, setCurrent }) => {

    //const [mornlist, setMornList] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)

    useEffect(() => {

    }, []);

    function handleChange() {
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

    function editFileNumber(file, id) {
       api.token.editFileNumber({file,id}).then((res)=>{
           const response = JSON.parse(res.data).result
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
                                <Th>Token No.
                                </Th>
                                <Th>Name</Th>
                                <Th>File No.</Th>
                                <Th>Type</Th>
                                <Th>In</Th>
                                <Th>Out</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filterList(mornlist).map((item, index) =>
                                <Tr key={index} bg={item.status == "completed" ? "gray.200" : (item.status == "current" ? "green.100" : "white")}>
                                    <Td><ButtonPopover current={current} setCurrent={setCurrent} item={item} /></Td>
                                    <Td >{`${item.slot}-${item.tokenNumber}`}</Td>
                                    <Td>{item.name}</Td>
                                    <Td><Editable onSubmit={(file) => editFileNumber(file,item.patientID)} defaultValue={item.fileNumber}>
                                        <EditablePreview />
                                        <EditableInput />
                                    </Editable></Td>
                                    <Td>{item.type}</Td>
                                    <Td>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                        .toLocaleTimeString('en-US',
                                            { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                    </Td>
                                    <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                        .toLocaleTimeString('en-US',
                                            { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                    </Td>
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
