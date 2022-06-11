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
    Checkbox
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const [hideAfternoon, setHideAfternoon] = useState(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() > morningEnd.getTime() ?
            false : true)
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])


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
                        <Table size="sm" variant='striped' colorScheme='grey'>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Token No.
                                    </Th>
                                    <Th>Name</Th>
                                    <Th></Th>
                                    {/* <Th>File No.</Th>
                                <Th>Type</Th>
                                <Th>In</Th>
                                <Th>Out</Th> */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filterList(aftlist).map((item, index) =>
                                    <Tr key={index} bg={item.status == "completed" ? "gray.200" : (item.status == "current" ? "green.100" : "white")}>
                                        <Td width={"10%"}><ButtonPopover loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                        <Td width={"25%"} >{`${item.slot}-${item.tokenNumber}`}</Td>
                                        <Td width={"35%"}>{item.name}</Td>
                                        <Td width={"10%"}><DetailsPopover current={current} setCurrent={setCurrent} item={item} /></Td>
                                        {/* <Td><Editable onSubmit={(file) => editFileNumber(file,item.patientID)} defaultValue={item.fileNumber}>
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
                                    </Td> */}
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
