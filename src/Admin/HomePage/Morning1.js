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
import { useState, useEffect, useRef, useContext } from 'react'
import api from '../../api';
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { useMediaQuery } from '@chakra-ui/react'
import "../../utils/table.css"
import { ListComponent } from './ListComponent';
import userApi from '../../api/user';
import { AppContext } from '../../App';
import { SortIcon, useSortableData } from '../../utils/sortTable';
import { HeaderComponent } from './HeaderComponent';

// List of staff profiles pending approval

export const MorningList1 = ({ isLoading, setIsLoading, mornlist, current, setCurrent, doctor, desktopView }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const { user } = useContext(AppContext)
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
    const { items, requestSort, sortConfig } = useSortableData(mornlist, { key: "tokenNumber", direction: "ascending" });

console.log(sortConfig)
    useEffect(() => {

       // console.log(aftlist)
    }, []);




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
                // bg={'white'}
                boxShadow={'lg'}
                p={0}
                width='full'>

                {isLaptop ? <TableContainer>
                    <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                        <HeaderComponent requestSort={requestSort} sortConfig={sortConfig} />

                        <Tbody>
                            {filterList(items, showCompleted).map((item, index) =>
                                <ListComponent desktopView={desktopView}  item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent} />
                            )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                    : filterList(items, showCompleted).map((item, index) =>
                        <ListComponent item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent} />
                    )

                }
            </Box>

        </>

    )
}