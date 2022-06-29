
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
    Flex,
    Stack,
    IconButton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';


// List of staff profiles pending approval

export const ReviewList = () => {

    const [reviewlist, setReviewList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {

        api.review.fetchReviewList().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReviewList(response)
        })

    }, []);




    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            <IconButton size="lg" onClick={() => navigate("/book-review")} icon={<ArrowBackIcon />}></IconButton>
            <Stack mx="auto" py={12}>
                <Heading size="md">Booked Tokens</Heading>
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
                                <Th>Type</Th>
                                <Th>Est. Time</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reviewlist.map((item, index) =>
                                <Tr key={index}>
                                    <Td >{item.name}</Td>
                                    <Td >{new Date(item.date).toDateString()}</Td>
                                    <Td >{item.tokenNumber}</Td>
                                    <Td>{item.reason}</Td>
                                    <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US',{ timeZone: 'Asia/Kolkata',  hour:'numeric', minute:"numeric" })}</Td>
                                    <Td><IconButton bg="transparent" icon={<DeleteIcon/>}></IconButton></Td>
                                </Tr>
                            )
                            }
                        </Tbody>
                    </Table>
                </Box>
            </Stack>
        </Flex>
    )
}

