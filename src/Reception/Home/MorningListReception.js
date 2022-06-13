
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    HStack,
    Heading,
    Checkbox,
    Editable,
    EditablePreview,
    EditableInput,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../../api';
import { ButtonPopoverReception } from './PopoverReception';


// List of staff profiles pending approval

export const MorningListReception = ({ isLoading, setIsLoading, mornlist, current, setCurrent }) => {

    //const [mornlist, setMornList] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)
    const [file, setFile] = useState("")
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
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


    function editFileNumber(value,id) {
        api.token.editFileNumber({ value, id }).then((res) => {
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
                p={3}
                width='auto'>
                <Table variant='striped' colorScheme='grey'>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Token
                            </Th>
                            <Th>Type</Th>
                            <Th>Name</Th>
                            <Th>File No.</Th>
                            <Th>Type</Th>
                            <Th>Phone</Th>
                            <Th>In</Th>
                            <Th>Out</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterList(mornlist).map((item, index) =>
                            <Tr key={index} bg={item.status == "completed" ? "gray.200" : (item.status == "current" ? "green.100" : "white")}>
                                <Td ><ButtonPopoverReception loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td >{types[item.type]}</Td>
                                <Td >{item.name}</Td>
                                <Td>
                                    <Editable onSubmit={(value) => editFileNumber(value,item.patientID)} defaultValue={item.fileNumber}>
                                        <EditablePreview />
                                        <EditableInput />
                                    </Editable>
                                </Td>
                                <Td> {item.type}</Td>
                                <Td>{item.phone.substring(2)}</Td>
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
            </Box>

        </>
    )
}
