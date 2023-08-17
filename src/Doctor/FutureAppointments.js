
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
    Divider,
    Select,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../api';
import { ArrowBackIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FullPageSpinner } from '../components/Spinner';
import { FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from '@chakra-ui/react'
import { AppContext } from '../App';
import { filterDoctor } from '../utils/tokenFunctions';


export const FutureAppointments = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useContext(AppContext)
    let doctor = user.doctorID
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).toDateString()

    useEffect(() => {

        setIsLoading(true)
        api.review.fetchReviewList({ doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            setReviewList(response)
        }).catch(err => {
            setIsLoading(false)
            window.alert(err)
            //console.log(err)
        })


    }, [doctor]);



    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            {isLoading ? <FullPageSpinner /> :
                <>
                    {isLaptop && <>


                        <Stack py={12} px={2} mx="auto" width="auto">
                            {/* <Box align='center'>
                        <Select width={isLaptop ? "30%" : "full"} size={"lg"} value={doctor} onChange={handleChange} bg="white">
                        {doctors.map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box> */}

                            <>

                                <Heading size="md">Booked Tokens</Heading>
                                <Box
                                    rounded={'lg'}
                                    bg={'white'}
                                    boxShadow={'lg'}
                                    p={3}
                                    width='auto'>

                                    {reviewlist.map((review, index) => <>
                                        <Heading m={8} size="md" color="red">{new Date(review.date).toDateString() == today ? "TODAY" : new Date(review.date).toDateString()}</Heading>

                                        <Divider orientation='horizontal'></Divider>
                                        <Table variant='striped' colorScheme='grey'>
                                            <Thead>
                                                <Tr>
                                                    <Th>Name</Th>
                                                    <Th>Token</Th>
                                                    <Th>Type</Th>
                                                    <Th>Date</Th>
                                                    <Th>Est. Time</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {reviewlist[index].reviews.map((item) =>
                                                    <Tr key={index}>
                                                        <Td >{item.tokenCount ? `${item.name} (${item.tokenCount})` : item.name}</Td>
                                                        <Td >{item.tokenNumber}</Td>
                                                        <Td>{item.type}</Td>
                                                        <Td >{new Date(item.date).toDateString()}</Td>
                                                        <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}</Td>

                                                    </Tr>
                                                )
                                                }
                                            </Tbody>
                                        </Table></>
                                    )}
                                </Box></>

                        </Stack>
                    </>}
                    {isMobile &&
                        <Stack width="full" alignItems="baseline" py={2} mx="2">

                            <Heading size="md">Booked Tokens</Heading>
                            {reviewlist.map((item, index) =>
                                <><Heading size="md" color="red" pt={3}>{new Date(item.date).toDateString() == today ? "TODAY" : new Date(item.date).toDateString()}</Heading>
                                    {reviewlist[index].reviews.map((review) => <Box
                                        rounded={'lg'}
                                        bg={'white'}
                                        boxShadow={'lg'}
                                        p={3}
                                        my={5}
                                        width='full'>
                                        <VStack spacing={2} width="full" alignItems={"baseline"}>
                                            <HStack width="full" spacing="auto">
                                                <HStack ><Heading size={"md"}>{review.tokenCount ? `${review.name} (${review.tokenCount})` : review.name}</Heading>
                                                    </HStack>

                                            </HStack>
                                            <Heading size="sm">{`${review.tokenNumber} (${review.type}), ${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}`}</Heading>

                                        </VStack>
                                    </Box>)
                                    }</>)}
                        </Stack>

                    }

                </>}
        </Flex>
    )
}

