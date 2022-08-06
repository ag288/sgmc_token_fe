
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
    Select
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../api';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FullPageSpinner } from '../utils/spinner';
import { FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from '@chakra-ui/react'
import { AppContext } from '../App';

// List of staff profiles pending approval

export const DuplicatePatients = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [reviewlist, setReviewList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const {doctor, doctors, setDoctor} = useContext(AppContext)

    useEffect(() => {

        api.token.fetchDuplicatePatients().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReviewList(response)
        })

    }, [doctor]);


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


    function handleChange(e){
        setDoctor(e.target.value)
        localStorage.setItem("doctor", e.target.value)
    }


    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            {isLoading ? <FullPageSpinner /> :
                <>
                    {isLaptop && <>

                        <IconButton size="lg" onClick={() => navigate(-1)} icon={<ArrowBackIcon />}></IconButton>

                        <Stack py={12} px={2} mx="auto" width="full">
                        <Box align='center'>
                        <Select width={isLaptop ? "30%" : "full"} size={"lg"} value={doctor} onChange={handleChange} bg="white">
                        {doctors.map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box>
                            <Heading size="md">Duplicate Patients</Heading>
                            <Box
                                rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                p={3}
                                width='full'>

                                {reviewlist.map((review, index) => <>
                                
                                    <Divider mt={2} orientation='horizontal'></Divider>
                                    <Heading m={8} size="md" color="red">{`File Number: ${review.fileNumber}`}</Heading>

                                    <Table  variant='striped' colorScheme='grey'>
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Phone</Th>
                                                <Th>File Number</Th>
                                                
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {reviewlist[index].patients.map((item) =>
                                                <Tr key={index}>
                                                    <Td >{item.name}</Td>
                                                    <Td ><Text href={`tel:+${item.phone}`} as="a" bg="transparent" >{item.phone.substring(2)}</Text>
                                                    </Td>
                                                    <Td>{item.fileNumber}</Td>
                                                </Tr>
                                            )
                                            }
                                        </Tbody>
                                    </Table>
                                    <HStack mt={2}>
                                    <Button colorScheme={"blue"}>Merge</Button>
                                    <Button colorScheme={"blue"}>Keep separate</Button></HStack></>
                                )}
                            </Box>
                        </Stack>
                    </>}
                    {isMobile &&
                        <Stack width="full" alignItems="baseline" py={2} mx="2">
                            <IconButton size="lg" onClick={() => navigate(-1)} icon={<ArrowBackIcon />}></IconButton>
                            <Heading size="md">Duplicate Patients</Heading>
                            {reviewlist.map((item, index) =>
                                <><Heading size="md" color="red" pt={3}>{item.fileNumber}</Heading>
                                    {reviewlist[index].patients.map((review) => <Box
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
                                            </HStack>
                                           
                                        </VStack>
                                    </Box>)
                                    }</>)}
                        </Stack>
                    }

                </>}
        </Flex>
    )
}

