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
    Text,
    VStack
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DiffMinutes, diffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent }) => {

    const morningEnd = new Date(new Date().setHours(12, 30, 0));
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

    useEffect(() => {


    }, []);




    function handleChange() {
        setShowCompleted(!showCompleted)
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
                    p={3}
                    width='auto'>
                    <TableContainer>
                        <Table size="sm" variant='striped' colorScheme='grey'>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Token
                                    </Th>
                                    <Th>Type</Th>
                                    <Th>Name</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filterList(aftlist, showCompleted).map((item, index) =>
                                    <Tr key={index} bg={findBg(item)}>
                                        <Td width={"10%"}><ButtonPopover loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                        <Td width={"25%"} >{`${item.slot}-${item.tokenNumber}`}</Td>
                                        <Td width="10%">{types[item.type]}</Td>
                                        <Td width={"35%"}>{item.name}</Td>
                                        <Td width={"10%"}>
                                            <VStack>
                                                <DetailsPopover current={current} setCurrent={setCurrent} item={item} />
                                                <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                                                {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                                            </VStack>
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
