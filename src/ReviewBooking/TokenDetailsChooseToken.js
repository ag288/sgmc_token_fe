import {
    Box,
    Flex,
    Stack,
    Heading,
    VStack,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Select,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    HStack,
    Spinner,
    IconButton,
    Input,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import api from '../api';

export const TokenDetailsForReviewChooseToken = () => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const [tokens, setTokens] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState({
        date: "",
        slot: "",
        token: ""
    })
    const [tokenNo, setTokenNo] = useState("")
    const [holidays, setHolidays] = useState([])
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

    useEffect(() => {


        api.settings.fetchHolidays().then((res) => {
            const response = JSON.parse(res.data).result
            setHolidays(response)
            console.log(response)

        })

        api.review.decideSlotsReview().then((res) => {
            const response = JSON.parse(res.data).result
            setSlots(response)
        })

    }, [])

    let location = useLocation()

    function handleSlotChange(e) {
        console.log(e.target.value)
        setToken(prev => ({ ...prev, "slot": e.target.value }))
        api.review.fetchTokensReview({ slot: e.target.value, date:token.date }).then((res) => {
            const response = JSON.parse(res.data).result
            setTokens(response)
        })

    }

    function handleTokenChange(e) {
        setToken(prev => ({ ...prev, "token": e.target.value }))

    }


    function handleDateChange(e) {
        if (!(holidays.find(holiday => holiday.date.split("T")[0] == e.target.value)))
            setToken(prev => ({ ...prev, "date": e.target.value }))
        else
            alert("Selected date is a holiday!")
    }


    function handleSubmit() {
        if (token.slot != "" && token.token != "") {
            location.state.token.slot = token.slot
            location.state.token.date = token.date
            location.state.token.token = token.token
            location.state.token.id = location.state.id ? location.state.id : location.state.token.id
            setIsLoading(true)
            api.review.generateTokenReview({ token: location.state.token }).then((res) => {
                const response = JSON.parse(res.data)
                if (response.message != "") {
                    setIsLoading(false)
                    alert("All tokens are full for today. Please try again later")
                    navigate("/home")
                }
                else {
                    setIsLoading(false)
                    setTokenNo(`${response.slot}-${response.tokenNo}`)
                    setTime(response.time)
                    onOpen()
                }
            })
        }
        else {
            alert("Please fill in all the values")
        }
    }

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <IconButton isDisabled={isLoading} size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>

                {isLoading ? <Box width="full" alignItems={"center"} height="full"> <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size="xl"
                    ml={"40%"}
                    mt="20%"
                /> </Box> :
                    <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                        <Heading fontSize={'2xl'}>Book a Review</Heading>
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={8}>
                            <Stack spacing={4}>

                                <FormControl id="date" isRequired >
                                    <FormLabel >Select date</FormLabel>
                                    <Input value={token.date} onChange={handleDateChange} min={tomorrow} type="date"></Input>
                                </FormControl>

                                <FormControl id="slot" isRequired >
                                    <FormLabel >Select slot</FormLabel>
                                    <RadioGroup name="slot" >
                                        <VStack align={"right"}>
                                            {slots.map((slot) => <Radio bg={token.slot == slot.slotID ? "green" : "white"} value={slot.slotID} onChange={handleSlotChange}>{`${new Date('1970-01-01T' + slot.start + 'Z')
                                                .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.end + 'Z')
                                                    .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}</Radio>)}
                                  
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>

                                <FormControl id="token" isRequired >
                                    <FormLabel >Select token number</FormLabel>
                                    <RadioGroup name="token" >
                                        <VStack align={"right"}>
                                            {tokens.map((item) => <Radio bg={token.token == item.tokenID ? "green" : "white"} value={item.tokenID} onChange={handleTokenChange}>{item.tokenNumber}</Radio>)}
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>
                                {/* <FormControl id="reason">
                                    <FormLabel>Select reason</FormLabel>
                                    <Select placeholder='Select reason for visit' onChange={handleReasonChange}>
                                        {reasons.map(reason =>
                                            <option value={reason.reasonID}>{reason.name}</option>
                                        )}
                                    </Select>
                                </FormControl> */}
                            </Stack>
                            <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Booking successful</ModalHeader>
                                    <ModalBody>
                                        <HStack>
                                            <Text>Your token number is </Text> <Text fontWeight={"bold"}>{tokenNo}</Text>
                                        </HStack>
                                        <Text mt="2%">Your estimated consultation time is at</Text>
                                        <HStack alignItems={"baseline"}>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(time).toLocaleTimeString("en-us", { hour12: true, hour: "numeric", minute: "numeric" })}</Text>
                                            <Text mt="2%">on </Text>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(token.date).toDateString()}</Text>
                                        </HStack>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={() => navigate('/home')}>
                                            Ok
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <Button
                                onClick={handleSubmit}
                                m={4}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Generate Review Token
                            </Button>
                        </Box>
                    </Stack>}
            </Flex>
        </>
    )
}
