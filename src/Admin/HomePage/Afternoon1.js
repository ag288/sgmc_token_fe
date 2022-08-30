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

export const AfternoonList1 = ({ isLoading, setIsLoading, aftlist, current, setCurrent, doctor, desktopView, next }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const { user } = useContext(AppContext)
    const [hideAfternoon, setHideAfternoon] = useState(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() > morningEnd.getTime() ?
            false : true)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])
    const { items, requestSort, sortConfig } = useSortableData(aftlist, { key: "tokenNumber", direction: "ascending" });
console.log(desktopView)

    useEffect(() => {

        console.log(aftlist)
    }, []);




    function handleChange() {
        setShowCompleted(!showCompleted)
    }

    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Afternoon</Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
            </HStack>

            <Box
                rounded={'lg'}
                // bg={'white'}
                boxShadow={'lg'}
                p={0}
                width='full'>

                {isLaptop || desktopView ? <TableContainer>
                    <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                        <HeaderComponent sortConfig={sortConfig} requestSort={requestSort} />

                        <Tbody>
                            {filterList(items, showCompleted).map((item, index) =>
                                <ListComponent next={next}  desktopView={desktopView} item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent} />
                            )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                    : filterList(items, showCompleted).map((item, index) =>
                        <ListComponent next={next} desktopView={desktopView} item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent} />
                    )

                }
            </Box>

        </>

    )
}
