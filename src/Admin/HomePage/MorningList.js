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
    IconButton,
    Button
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
import { ListComponent } from './ListComponent';
import { useSortableData } from '../../utils/sortTable';

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
    const { items, requestSort, sortConfig } = useSortableData(mornlist, { key: "tokenNumber", direction: "ascending" });

    const { user } = useContext(AppContext)
    //let componentRef = useRef();

    function handleChange() {
        setShowCompleted(!showCompleted)
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
                                <Th onClick={() => requestSort('tokenNumber')}>Token</Th>
                                {isMobile && <Th>Type</Th>}
                                <Th onClick={() => requestSort('name')}>Name</Th>
                                {/* {isMobile && <Th></Th>} */}
                                {isMobile && <><Th onClick={() => requestSort('fileNumber')}>File No.</Th>
                                    <Th onClick={() => requestSort('timeInEst')}>Token Time</Th>
                                    <Th onClick={() => requestSort('time_of_arrival')}>Arrival Time</Th>
                                    <Th onClick={() => requestSort('timeIn')}>In</Th>
                                    <Th onClick={() => requestSort('timeOut')}>Out</Th>
                                    <Th>Phone</Th>
                                </>}
                                {isLaptop && <><Th onClick={() => requestSort('fileNumber')}>File No.</Th>
                                    <Th>Type</Th>
                                    <Th>Phone</Th>
                                    <Th onClick={() => requestSort('timeInEst')}>Token Time</Th>
                                    <Th onClick={() => requestSort('time_of_arrival')}>Arrival Time</Th>
                                    <Th onClick={() => requestSort('timeIn')}>In</Th>
                                    <Th onClick={() => requestSort('timeOut')}>Out</Th></>}
                                {user.userID == 2 && <Th></Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filterList(items, showCompleted).map((item, index) =>

                                <ListComponent item={item} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} index={index} current={current} setCurrent={setCurrent} />
                            )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>

        </>

    )
}
