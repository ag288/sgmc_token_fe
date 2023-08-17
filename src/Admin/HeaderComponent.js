
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react'

// List of staff profiles pending approval

export const HeaderComponent = ({ requestSort, sortConfig }) => {




    function decideStyle(key) {
        const style = { cursor: "pointer", background: sortConfig.key == key ? "lightgray" : "transparent" }
        return style
    }
    return (
        <Thead bg="white">
            <Tr>
                <Th style={decideStyle("tokenNumber")} onClick={() => requestSort('tokenNumber')}>Token</Th>

                <Th style={decideStyle("name")} onClick={() => requestSort('name')}>Name</Th>
              
                <Th style={decideStyle("fileNumber")} onClick={() => requestSort('fileNumber')}>File No.</Th>
                    <Th>Type</Th>
                    {/* <Th>Phone</Th> */}
                    <Th style={decideStyle("timeInEst")} onClick={() => requestSort('timeInEst')}>Token Time</Th>
                    <Th style={decideStyle("time_of_arrival")} onClick={() => requestSort('time_of_arrival')}>Arrival Time</Th>
                    <Th style={decideStyle("timeIn")} onClick={() => requestSort('timeIn')}>In</Th>
                    <Th style={decideStyle("timeOut")} onClick={() => requestSort('timeOut')}>Out</Th>
                 
            </Tr>
        </Thead>

    )
}