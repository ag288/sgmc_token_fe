import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
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

// List of staff profiles pending approval

export const HeaderComponent = ({ requestSort, sortConfig }) => {

    const morningEnd = new Date(new Date().setHours(14, 0, 0));
    const { user } = useContext(AppContext)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [showCompleted, setShowCompleted] = useState(false)
    //  const [aftlist, setAftList] = useState([])
    console.log(requestSort)
    // const { items, requestSort, sortConfig } = useSortableData(list, { key: "tokenNumber", direction: "ascending" });


    useEffect(() => {

    }, []);



    function decideStyle(key) {
        const style = { cursor: "pointer", background: sortConfig.key == key ? "lightgray" : "transparent" }
        return style
    }
    return (
        <Thead bg="white">
            <Tr>
                <Th></Th>
                <Th style={decideStyle("tokenNumber")} onClick={() => requestSort('tokenNumber')}>Token</Th>

                <Th style={decideStyle("name")} onClick={() => requestSort('name')}>Name</Th>
                {/* {isMobile && <Th></Th>} */}

                {/* {isMobile && <><Th style={decideStyle("fileNumber")} onClick={() => requestSort('fileNumber')}>File No.</Th>
                    <Th>Type</Th>
                    <Th style={decideStyle("timeInEst")} onClick={() => requestSort('timeInEst')}>Token Time</Th>
                    <Th style={decideStyle("time_of_arrival")} onClick={() => requestSort('time_of_arrival')}>Arrival Time</Th>
                    <Th style={decideStyle("timeIn")} onClick={() => requestSort('timeIn')}>In</Th>
                    <Th style={decideStyle("timeOut")} onClick={() => requestSort('timeOut')}>Out</Th>
                    <Th>Phone</Th>
                </>} */}

                {/* {isLaptop && <> */}
                <Th style={decideStyle("fileNumber")} onClick={() => requestSort('fileNumber')}>File No.</Th>
                    <Th>Type</Th>
                    <Th>Phone</Th>
                    <Th style={decideStyle("timeInEst")} onClick={() => requestSort('timeInEst')}>Token Time</Th>
                    <Th style={decideStyle("time_of_arrival")} onClick={() => requestSort('time_of_arrival')}>Arrival Time</Th>
                    <Th style={decideStyle("timeIn")} onClick={() => requestSort('timeIn')}>In</Th>
                    <Th style={decideStyle("timeOut")} onClick={() => requestSort('timeOut')}>Out</Th>
                    {/* </>} */}
                {user.userID == 2 && <Th></Th>}
            </Tr>
        </Thead>

    )
}