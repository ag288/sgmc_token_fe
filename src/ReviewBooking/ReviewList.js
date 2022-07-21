
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
    useToast,
    Button,
    Icon,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FullPageSpinner } from '../utils/spinner';
import { FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from '@chakra-ui/react'

// List of staff profiles pending approval

export const ReviewList = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {

        api.review.fetchReviewList().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReviewList(response)
        })

    }, []);


    function deleteReview(item) {
        const flag = window.confirm(`Warning!\nYou are going to delete review of ${item.name}`)
        if (flag) {
            setIsLoading(true)
            api.review.deleteReview({ id: item.reviewID }).then((res) => {
                setIsLoading(false)
               // window.location.reload()
                toast({
                    title: 'Deleted review successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                    position: "top"
                })
            }).catch((err) => {
                setIsLoading(false)
                toast({
                    title: 'Something went wrong',
                    status: 'error',
                    duration: 3000,
                    isClosable: false,
                    position: "top"
                })
            })
        }
    }



    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            <IconButton size="lg" onClick={() => navigate("/book-review")} icon={<ArrowBackIcon />}></IconButton>
            {isLoading ? <FullPageSpinner /> :
                <Stack mx="auto" py={12}>
                    <Heading size="md">Booked Tokens</Heading>
                 {isLaptop &&   <Box
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={3}
                        width='auto'>
                        <Table variant='striped' colorScheme='grey'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Phone</Th>
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
                                        <Td ><Text href={`tel:+${item.phone}`} as="a" bg="transparent" >{item.phone.substring(2)}</Text>
                                        </Td>
                                        <Td >{new Date(item.date).toDateString()}</Td>
                                        <Td >{item.tokenNumber}</Td>
                                        <Td>{item.type}</Td>
                                        <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}</Td>
                                        <Td><IconButton bg="transparent" onClick={() => deleteReview(item)} icon={<DeleteIcon />}></IconButton></Td>
                                    </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                    </Box>}

                    {isMobile && reviewlist.map((review)=><Box
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={3}
                        width='full'>
                            <VStack spacing={2} width="full" alignItems={"baseline"}>
                       <HStack width="full" spacing={"auto"}><Heading size={"md"}>{review.name}</Heading>
                       <IconButton bg="transparent" onClick={() => deleteReview(review)} icon={<DeleteIcon />}></IconButton>
                       </HStack> 
                       <Heading size="sm">{`${review.tokenNumber} (${review.type})`}</Heading>
                        <Text>{`${new Date(review.date).toDateString()}, ${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}`
                        }</Text>
                        <HStack>
                        <Text >{review.phone.substring(2)}</Text>
                       <IconButton icon={<FaPhoneAlt/>} href={`tel:+${review.phone}`} as="a" bg="transparent"></IconButton>
                        </HStack>            
                        </VStack>
                        </Box>)}
                </Stack>
            }
        </Flex>
    )
}

