import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    HStack,
    Heading,
    Checkbox,
    Editable,
    EditablePreview,
    EditableInput,
    Text
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../../api';
import { ButtonPopoverReception } from './PopoverReception';


// List of staff profiles pending approval

export const AfternoonListReception = ({ isLoading, setIsLoading, aftlist, current, setCurrent }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const [hideAfternoon, setHideAfternoon] = useState(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() > morningEnd.getTime() ?
            false : true)
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
    const [file, setFile] = useState("")

   
    useEffect(() => {


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

    function handleDoubleClick(id) {
        let fileNo = window.prompt("Enter the file number")
        editFileNumber(fileNo, id)
    }


    function editFileNumber(value,id) {
        api.token.editFileNumber({ value, id }).then((res) => {
            const response = JSON.parse(res.data).result
            window.location.reload()
        })
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
                        {filterList(aftlist).map((item, index) =>
                            <Tr key={index} bg={item.status == "completed" ? "gray.200" : (item.status == "current" ? "green.100" : "white")}>
                                <Td><ButtonPopoverReception loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td>{types[item.type]}</Td>
                                <Td >{item.name}</Td>
                                {/* <Td>
                                <Editable onSubmit={(value) => editFileNumber(value,item.patientID)}  defaultValue={item.fileNumber ? item.fileNumber : "Add file"}>
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        </Td> */}
                          <Td><Text placeholder='Add file' onDoubleClick={() => handleDoubleClick(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                </Td>
                        <Td> {item.type}</Td>
                        <Td>{item.phone.substring(2)}</Td>
                        <Td>{ item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
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
                </Box>}

        </>

    )
}
