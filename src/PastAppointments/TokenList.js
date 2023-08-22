import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    Table,
    Thead,
    Tbody,
    TableContainer,
    Box,
    Heading,
} from '@chakra-ui/react'
import {FullPageSpinner} from '../components/Spinner'
import { useState, useEffect, useRef, useContext } from 'react'
import { useMediaQuery } from '@chakra-ui/react'
import "../utils/table.css"
import { ListComponent } from '../Admin/ListComponent';
import { SortIcon, useSortableData } from '../utils/sortTable';
import { HeaderComponent } from '../Admin/HeaderComponent';
import api from '../api';


export const TokenList = ({ doctor, desktopView, date }) => {

    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [list, setList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { items, requestSort, sortConfig } = useSortableData(list, { key: "tokenNumber", direction: "ascending" });


    useEffect(() => {


        if (date) {
            setIsLoading(true)
            api.token.fetchPastAppointments({ doctor: doctor.doctorID, date }).then((res) => {
                setIsLoading(false)
                let response = JSON.parse(res.data).result
                setList(response)
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }, [date]);




    return (
        <>
            <Box
                rounded={'lg'}
                // bg={'white'}
                boxShadow={'lg'}
                p={0}
                width='full'>
                {isLoading ? <FullPageSpinner /> : <>
                    {isLaptop || desktopView ? <TableContainer>
                        <Table variant='striped' size={isMobile ? "sm" : "md"} colorScheme='grey'>
                            <HeaderComponent requestSort={requestSort} sortConfig={sortConfig} />

                            <Tbody>
                                {items.map((item, index) =>
                                    <ListComponent desktopView={desktopView} item={item} index={index} doctor={doctor} />
                                )
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>

                        : items.map((item, index) =>
                            <ListComponent item={item} index={index} doctor={doctor} />
                        )

                    }
                </>}
            </Box>

        </>

    )
}
