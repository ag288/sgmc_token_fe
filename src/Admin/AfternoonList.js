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
} from '@chakra-ui/react'
import { useState, useEffect, useRef, useContext } from 'react'
import { useMediaQuery } from '@chakra-ui/react'
import "../utils/table.css"
import { ListComponent } from './ListComponent';
import { SortIcon, useSortableData } from '../utils/sortTable';
import { HeaderComponent } from './HeaderComponent';

// List of staff profiles pending approval

export const AfternoonList = ({ aftlist, current, setCurrent, doctor, desktopView}) => {

  
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
   

  
    const { items, requestSort, sortConfig } = useSortableData(aftlist, { key: "tokenNumber", direction: "ascending" });


    useEffect(() => {

        // console.log(aftlist)
    }, []);




    return (
        <>


            <Heading size="md">Afternoon </Heading>


            <Box
                rounded={'lg'}
                // bg={'white'}
                boxShadow={'lg'}
                p={0}
                width='full'>

                {isLaptop || desktopView ? <TableContainer>
                    <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                        <HeaderComponent requestSort={requestSort} sortConfig={sortConfig} />

                        <Tbody>
                            {items.map((item, index) =>
                                <ListComponent  desktopView={desktopView} item={item} index={index}  doctor={doctor} current={current} setCurrent={setCurrent} />
                            )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                    : items.map((item, index) =>
                        <ListComponent item={item} index={index} doctor={doctor} current={current} setCurrent={setCurrent} />
                    )

                }
            </Box>

        </>

    )
}
