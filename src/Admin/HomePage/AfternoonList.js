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
import { useState, useEffect, useRef } from 'react'
import api from '../../api';
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { useMediaQuery } from '@chakra-ui/react'
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';
import { isContentEditable } from '@testing-library/user-event/dist/utils';
import { FaPrint } from 'react-icons/fa';
import { ComponentToPrint } from './TokenPrint';
import ReactToPrint from 'react-to-print'
import { ListComponent } from './ListComponent';

// List of staff profiles pending approval

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent, doctor }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const [hideAfternoon, setHideAfternoon] = useState(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() > morningEnd.getTime() ?
            false : true)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
    let componentRef = useRef()

    useEffect(() => {

        console.log(aftlist)
    }, []);




    function handleChange() {
        setShowCompleted(!showCompleted)
    }

    function handleDoubleClickForFile(id) {
        let fileNo = window.prompt("Enter the file number")
        if (fileNo != null) {
            //  editFileNumber(fileNo, id)
            api.token.editFileNumber({ fileNo, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
        }
    }

    function handleDoubleClickForName(id) {
        let name = window.prompt("Enter the patient's name")
        if (name != null) {
            api.token.editName({ name, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
        }
    }

    function editFileNumber(value, id) {
        api.token.editFileNumber({ value, id }).then((res) => {
            const response = JSON.parse(res.data).result
            window.location.reload()
        })
    }

    function setAsArrived(item) {
        if (!(item.time_of_arrival)) {
            api.token.setAsArrived({ item }).then((res) => {
                //   window.location.reload()
            })
        }
    }

    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Afternoon {hideAfternoon ? <ChevronDownIcon onClick={() => setHideAfternoon(false)} /> : <ChevronUpIcon onClick={() => setHideAfternoon(true)} />} </Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
            </HStack>
            {hideAfternoon ? null :
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
                                        <Th>Arrival Time</Th>
                                        <Th>In</Th>
                                        <Th>Out</Th>
                                        <Th></Th></>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filterList(aftlist, showCompleted).map((item, index) =>
                                    // <Tr key={index} bg={findBg(item, aftlist)}>
                                    //     <Td><ButtonPopover doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                    //     <Td >{item.slot.includes("W")?`${item.initials}W-${item.tokenNumber}` :`${item.initials}-${item.tokenNumber}`}</Td>
                                    //     {isMobile && <Td>{types[item.type]}</Td>}
                                    //     <Td style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}</Td>
                                    //     {isMobile && <Td>
                                    //         <VStack>
                                    //             <DetailsPopover doctor={doctor} current={current} setCurrent={setCurrent} item={item} />
                                    //             <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                    //             {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                                    //         </VStack>
                                    //     </Td>}
                                    //     {isLaptop && <><Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                                    //     </Td>
                                    //         <Td> {item.type}</Td>
                                    //         <Td>{item.phone.substring(2)}</Td>
                                    //         <Td>{item.timeInEst &&
                                    //             <VStack alignItems={"baseline"}>
                                    //                 <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                                    //                     .toLocaleTimeString('en-US',
                                    //                         { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                    //                 </Text>
                                    //                 <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                    //             </VStack>}
                                    //         </Td>
                                    //         <Td ><Text>{item.time_of_arrival ? `${new Date('1970-01-01T' + item.time_of_arrival + 'Z')
                                    //             .toLocaleTimeString('en-US',
                                    //                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}🟢` : ""}</Text>
                                    //         </Td>
                                    //         <Td>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                    //             .toLocaleTimeString('en-US',
                                    //                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                    //         </Td>
                                    //         <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                    //             .toLocaleTimeString('en-US',
                                    //                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                    //         </Td>
                                            
                                    //         <Td>  <ReactToPrint
                                    //             onAfterPrint={()=>setAsArrived(item)}
                                    //             trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                                    //             content={() => componentRef.current}
                                    //         />
                                    //                 <ComponentToPrint ref={componentRef} item={item} />
                                    //             </Td></>}

                                    // </Tr>
                                    <ListComponent item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent}/>
                                )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>}

        </>

    )
}
