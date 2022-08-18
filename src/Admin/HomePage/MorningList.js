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
    Text,
    VStack,
    InputGroup,
    IconButton
} from '@chakra-ui/react'
import { useState, useEffect, useContext, useRef } from 'react'
import api from '../../api';
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { useMediaQuery } from '@chakra-ui/react'
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';
import userApi from '../../api/user';
import { AppContext } from '../../App';
import { FaPrint } from 'react-icons/fa';
import { ComponentToPrint } from './TokenPrint';
import ReactToPrint from 'react-to-print'

// List of staff profiles pending approval

export const MorningList = ({ isLoading, setIsLoading, mornlist, current, setCurrent, doctor }) => {

    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
   // const { user } = useContext(AppContext)
    let componentRef = useRef(); 

    function handleChange() {
        setShowCompleted(!showCompleted)
    }

    function handleDoubleClickForFile(id) {
        let fileNo = window.prompt("Enter the file number")
        if (fileNo != null)
            //  editFileNumber(fileNo, id)
            api.token.editFileNumber({ fileNo, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
    }

    function handleDoubleClickForName(id) {
        let name = window.prompt("Enter the patient's name")
        if (name != null)
            api.token.editName({ name, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
    }

    function editFileNumber(value, id) {

    }


    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Morning </Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
            </HStack>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={0}
                width='auto'>
                <TableContainer>
                    <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Token
                                </Th>
                                {isMobile && <Th>Type</Th>}
                                <Th>Name</Th>
                                {isMobile && <Th></Th>}
                                {isLaptop && <><Th>File No.</Th>
                                    <Th>Type</Th>
                                    <Th>Phone</Th>
                                    <Th>Token Time</Th>
                                    <Th>In</Th>
                                    <Th>Out</Th>
                                    <Th></Th></>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filterList(mornlist, showCompleted).map((item, index) =>
                                <Tr key={index} bg={findBg(item, mornlist)}>
                                    <Td><ButtonPopover doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                    <Td >{item.slot.includes("W")?`${item.initials}W-${item.tokenNumber}` :`${item.initials}-${item.tokenNumber}`}</Td>
                                    {isMobile && <Td>{types[item.type]}</Td>}
                                    <Td style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}</Td>
                                    {isMobile && <Td>
                                        <VStack>
                                            <DetailsPopover doctor={doctor} current={current} setCurrent={setCurrent} item={item} />
                                            <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                            {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                                        </VStack>
                                    </Td>}
                                    {isLaptop && <><Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                    </Td>
                                        <Td> {item.type}</Td>
                                        <Td>{item.phone.substring(2)}</Td>
                                        <Td>
                                            {item.timeInEst && <VStack alignItems={"baseline"}>
                                                <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                                                    .toLocaleTimeString('en-US',
                                                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                                </Text>
                                                <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                            </VStack>}
                                        </Td>
                                        <Td>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                            .toLocaleTimeString('en-US',
                                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                        </Td>
                                        <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                            .toLocaleTimeString('en-US',
                                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                        </Td> <Td>  <ReactToPrint
                                        trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                                        content={() => componentRef}
                                    />
                                        <div style={{ display: "none" }}>
                                            <ComponentToPrint ref={(el) => (componentRef = el)} item={item} />
                                        </div></Td></>}
                                   
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
