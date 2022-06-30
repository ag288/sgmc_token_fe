
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
    Text,
    VStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';
import { FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive'
import api from '../../api';

// List of staff profiles pending approval

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent }) => {

    //const [mornlist, setMornList] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)
    const isLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
      })
      const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
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
                p={0}
                width='auto'>
                <Table size="sm" variant='striped' colorScheme='grey'>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Token
                            </Th>
                            <Th>Type</Th>
                            <Th>Name</Th>
                          {isMobile &&  <Th></Th>}
                            {isLaptop && <><Th>File No.</Th>
                                    <Th>Type</Th>
                                    <Th>Phone</Th>
                                    <Th>Token Time</Th>
                                    <Th>In</Th>
                                    <Th>Out</Th></>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterList(aftlist, showCompleted).map((item, index) =>
                            <Tr key={index} bg={findBg(item)}>
                                <Td width={"10%"}><ButtonPopover loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td width={"25%"} >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td width="10%">{types[item.type]}</Td>
                                <Td width={"25%"}>{item.name}</Td>
                                {isMobile && <Td width={"10%"}>
                                    <VStack>
                                    <DetailsPopover current={current} setCurrent={setCurrent} item={item} />
                                    <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item}/>
                                    {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                                    </VStack>
                                </Td>}
                                {isLaptop &&<><Td><Text placeholder='Add file' onDoubleClick={() => handleDoubleClick(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
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
                                        </Td></> }
                            </Tr>
                        )
                        }
                    </Tbody>
                </Table>
            </Box>

        </>
    )
}
