
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

// List of staff profiles pending approval

export const ReviewList = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])
    const [settings, setSettings] = useState([])
    const [reasons, setReasons] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const { doctor, doctors, setDoctor, user, index, setIndex } = useContext(AppContext)
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).toDateString()

    useEffect(() => {

        api.review.fetchReviewList({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setReviewList(response)
        })
        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        })

    }, [doctor]);


    function deleteReview(item) {
        const flag = window.confirm(`Warning!\nYou are going to delete review of ${item.name}`)
        if (flag) {
            setIsLoading(true)
            api.review.deleteReview({ id: item.reviewID }).then((res) => {
                setIsLoading(false)
                window.location.reload()
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


    function handleChange(e) {
        setDoctor(e.target.value)
        localStorage.setItem("doctor", e.target.value)
    }

    function handleNewChange(index) {
        let docArray = filterDoctor(doctors, user.userID)
        setDoctor(docArray[index].doctorID)
        setIndex(index)
        localStorage.setItem("doctor", docArray[index].doctorID)
        localStorage.setItem("tabIndex", index)
    }

    function editReview(item) {
        let token = {
            id: item.patientID,
            phone: item.phone.substring(2),
            new_name: "",
            name: item.name,
            fileNumber: item.fileNumber,
            doctor: doctor
        }
        navigate("/review-details", { state: { token, settings, reasons, origin : "editReview" } })
    }

    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            {isLoading ? <FullPageSpinner /> :
                <>
                    {isLaptop && <>

                        <IconButton size="lg" onClick={() => navigate("/book-review")} icon={<ArrowBackIcon />}></IconButton>

                        <Stack py={12} px={2} mx="auto" width="auto">
                            {/* <Box align='center'>
                        <Select width={isLaptop ? "30%" : "full"} size={"lg"} value={doctor} onChange={handleChange} bg="white">
                        {doctors.map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box> */}
                            <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                                <TabList m={1}>
                                    {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                                        : <Tab >{doctor.longInitials}</Tab>)}
                                </TabList>

                                <TabPanels>
                                    {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                                        <>

                                            <Heading size="md">Booked Tokens</Heading>
                                            <Box
                                                rounded={'lg'}
                                                bg={'white'}
                                                boxShadow={'lg'}
                                                p={3}
                                                width='auto'>

                                                {reviewlist.map((review, index) => <>
                                                    <Heading m={8} size="md" color="red">{new Date(review.date).toDateString()==today ? "TODAY" : new Date(review.date).toDateString() }</Heading>

                                                    <Divider orientation='horizontal'></Divider>
                                                    <Table variant='striped' colorScheme='grey'>
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Name</Th>
                                                                <Th>Phone</Th>
                                                                <Th>Token</Th>
                                                                <Th>Type</Th>
                                                                <Th>Date</Th>
                                                                <Th>Est. Time</Th>
                                                                { new Date(review.date).toDateString()!=today && <Th></Th>}
                                                                <Th></Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {reviewlist[index].reviews.map((item) =>
                                                                <Tr key={index}>
                                                                    <Td >{item.name}</Td>
                                                                    <Td ><Text href={`tel:+${item.phone}`} as="a" bg="transparent" >{item.phone.substring(2)}</Text>
                                                                    </Td>
                                                                    <Td >{item.tokenNumber}</Td>
                                                                    <Td>{item.type}</Td>
                                                                    <Td >{new Date(item.date).toDateString()}</Td>
                                                                    <Td>{new Date(`1970-01-01 ${item.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}</Td>
                                                                   { new Date(reviewlist[index].date).toDateString()==today ? <Td textColor={item.status=="pending" ? "red" : "green"} borderBottomColor={"black"}>{item.status}</Td>
                                                                   : <><Td><IconButton bg="transparent" onClick={() => deleteReview(item)} icon={<DeleteIcon />}></IconButton></Td>
                                                                    <Td> <IconButton bg="transparent" onClick={() => editReview(item)} icon={<EditIcon />}></IconButton>
                                                                    </Td></>}
                                                                </Tr>
                                                            )
                                                            }
                                                        </Tbody>
                                                    </Table></>
                                                )}
                                            </Box></>
                                    </TabPanel>)}
                                </TabPanels>
                            </Tabs>
                        </Stack>
                    </>}
                    {isMobile &&
                        <Stack width="full" alignItems="baseline" py={2} mx="2">

                            <IconButton size="lg" onClick={() => navigate("/book-review")} icon={<ArrowBackIcon />}></IconButton>

                            <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                                <TabList m={1}>
                                    {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                                        : <Tab >{doctor.longInitials}</Tab>)}
                                </TabList>

                                <TabPanels>
                                    {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>


                                        <Heading size="md">Booked Tokens</Heading>
                                        {reviewlist.map((item, index) =>
                                            <><Heading size="md" color="red" pt={3}>{new Date(item.date).toDateString()}</Heading>
                                                {reviewlist[index].reviews.map((review) => <Box
                                                    rounded={'lg'}
                                                    bg={'white'}
                                                    boxShadow={'lg'}
                                                    p={3}
                                                    m={5}
                                                    width='full'>
                                                    <VStack spacing={2} width="full" alignItems={"baseline"}>
                                                        <HStack width="full" spacing="auto">
                                                            <HStack ><Heading size={"md"}>{review.name}</Heading>
                                                                <IconButton icon={<FaPhoneAlt />} href={`tel:+${review.phone}`} as="a" bg="transparent"></IconButton>

                                                            </HStack>
                                                            <IconButton bg="transparent" onClick={() => deleteReview(review)} icon={<DeleteIcon />}></IconButton>
                                                            <IconButton bg="transparent" onClick={() => editReview(review)} icon={<EditIcon />}></IconButton>
                                                        </HStack>
                                                        <Heading size="sm">{`${review.tokenNumber} (${review.type}), ${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}`}</Heading>

                                                    </VStack>
                                                </Box>)
                                                }</>)}

                                    </TabPanel>)}
                                </TabPanels>
                            </Tabs>
                        </Stack>

                    }

                </>}
        </Flex>
    )
}

