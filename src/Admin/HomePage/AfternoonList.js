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

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent, doctor }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const { user } = useContext(AppContext)
    const [hideAfternoon, setHideAfternoon] = useState(
        new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() > morningEnd.getTime() ?
            false : true)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [showCompleted, setShowCompleted] = useState(false)
    
    const { items, requestSort, sortConfig } = useSortableData(aftlist, { key: "tokenNumber", direction: "ascending" });


    useEffect(() => {

        console.log(aftlist)
    }, []);




    function handleChange() {
        setShowCompleted(!showCompleted)
    }

function decideStyle(key){
    const style = {cursor : "pointer",background : sortConfig.key==key? "lightgray" : "transparent"}
    return style
}
    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Afternoon {hideAfternoon ? <ChevronDownIcon onClick={() => setHideAfternoon(false)} /> : <ChevronUpIcon onClick={() => setHideAfternoon(true)} />} </Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
            </HStack>
            {/* {hideAfternoon ? null : */}
                <Box
                    rounded={'lg'}
                    bg={'white'}
                    boxShadow={'lg'}
                    p={0}
                    width='auto'>
                    <TableContainer>
                        <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                            <HeaderComponent list={aftlist}/>
                            <Tbody>
                                {filterList(items, showCompleted).map((item, index) =>
                                    <ListComponent item={item} index={index} loading={isLoading} setIsLoading={setIsLoading} doctor={doctor} current={current} setCurrent={setCurrent} />
                                )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {/* } */}

        </>

    )
}
