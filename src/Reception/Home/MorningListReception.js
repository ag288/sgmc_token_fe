
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
    VStack,
    Editable,
    EditablePreview,
    EditableInput,
    Text,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../../api';
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
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


    function handleDoubleClick(id) {
        let fileNo = window.prompt("Enter the file number")
        if (fileNo != null)
            editFileNumber(fileNo, id)
    }


    function editFileNumber(value, id) {
        api.token.editFileNumber({ value, id }).then((res) => {
            const response = JSON.parse(res.data).result
            window.location.reload()
        })
    }


    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Morning</Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
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
                            <Th>Token Time</Th>
                            <Th>In</Th>
                            <Th>Out</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterList(mornlist, showCompleted).map((item, index) =>
                            <Tr key={index} bg={findBg(item)}>
                                <Td ><ButtonPopoverReception loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td >{types[item.type]}</Td>
                                <Td >{item.name}</Td>
                                {/* <Td>
                                    <Editable onSubmit={(value) => editFileNumber(value,item.patientID)} defaultValue={item.fileNumber}>
                                        <EditablePreview placeholder="Add file"/>
                                        <EditableInput placeholder="Add file"/>
                                    </Editable>
                                    
                                </Td> */}
                                <Td><Text placeholder='Add file' onDoubleClick={() => handleDoubleClick(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                </Td>
                                <Td> {item.type}</Td>
                                <Td>{item.phone.substring(2)}</Td>
                                <Td>
                                    <VStack>
                                        <Text>  {item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                                            .toLocaleTimeString('en-US',
                                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                        </Text>
                                        <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                    </VStack>
                                </Td>
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
