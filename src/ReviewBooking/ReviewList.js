
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
    VStack,
    Editable,
    EditablePreview,
    EditableInput,
    Text,
} from '@chakra-ui/react'
import { isValidTimestamp } from '@firebase/util';
import { useState, useEffect } from 'react'
import api from '../../api';
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { ButtonPopoverReception } from './PopoverReception';


// List of staff profiles pending approval

export const MorningListReception = () => {

    const [reviewlist, setReviewList] = useState([])

    useEffect(() => {

        

    }, []);




    return (
        <>

                <Heading size="md">Reviews</Heading>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={3}
                width='auto'>
                <Table variant='striped' colorScheme='grey'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Date</Th>
                            <Th>Token</Th>
                            <Th>Time Slot</Th>
                            <Th>Est. Time</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reviewlist.map((item, index) =>
                            <Tr key={index}>
                                <Td >{item.name}</Td>
                                <Td >{item.date}</Td>
                                <Td >{item.tokenNumber}</Td>
                                <Td >{`${item.start}-${item.end}`}</Td>
                                <Td>{item.timeInEst}</Td>
                            </Tr>
                        )
                        }
                    </Tbody>
                </Table>
            </Box>

        </>
    )
}

