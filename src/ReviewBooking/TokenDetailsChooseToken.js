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
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { FullPageSpinner } from '../utils/spinner';

export const TokenDetailsForReviewChooseToken = () => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const [tokens, setTokens] = useState([])
    // const [reasons, setReasons] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    let location = useLocation()
    const settings = location && location.state ? location.state.settings : {}
    const [token, setToken] = useState({
        date: "",
        slot: "",
        token: "",
        reason: ""
    })
    const [tokenNo, setTokenNo] = useState("")

    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
    const [maxdate, setMaxDate] = useState(new Date(today.setDate(today.getDate() + parseInt(location.state?.settings.review_date_limit))).toISOString().split('T')[0])
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, doctor,doctors } = useContext(AppContext)
    //let maxdate=30
    useEffect(() => {



        // api.settings.fetchSettings().then((res) => {
        //     const response = JSON.parse(res.data).result
        //     setMaxDate(new Date(today.setDate(today.getDate() + parseInt(response[0].review_date_limit))).toISOString().split('T')[0])
        // })

        // api.settings.fetchReasons().then((res) => {
        //     const response = JSON.parse(res.data).result
        //     setReasons(response)
        // })

        api.review.reviewExists({ id: location.state.id ? location.state.id : location.state.token.id, doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            if (response.length != 0) {
                let update = window.confirm(`A review already exists for ${location.state.token.name} on ${new Date(response[0].date).toDateString()}. Proceed to update existing review?`)
                if (!update) {
                    navigate("/home")

                }

            }
        })
    }, [])


    function handleSlotChange(e) {
        setIsLoading(true)
        setToken(prev => ({ ...prev, "slot": e.target.value }))
        api.review.fetchTokensReview({ slot: e.target.value, date: token.date, doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            setTokens(response)
        })

    }

    function handleTokenChange(e) {
        setToken(prev => ({ ...prev, "token": e.target.value }))

    }

    function handleReasonChange(e) {
        setToken(prev => ({ ...prev, "reason": e.target.value }))

    }

    function handleDateChange(e) {

        const dateValue = e.target.value
        // setIsLoading(true)
        api.review.decideSlotsReview({ date: e.target.value, doctor }).then((res) => {
            //  setIsLoading(false)
            const response = JSON.parse(res.data)
            if (!response.result) {
                alert(response.message)
            }
            else {
                setToken(prev => ({ ...prev, "date": dateValue }))
                setSlots(response.result)
            }
        })
    }

    function handleSubmit() {
        console.log(token)
        if (token.slot != "" && token.token != "" && token.date != "") {
            location.state.token.slot = token.slot
            location.state.token.date = token.date
            location.state.token.token = token.token
            location.state.token.reason = user.userID == 3 ? 1 : token.reason
            location.state.token.id = location.state.id ? location.state.id : location.state.token.id
            location.state.token.creator = user.userID
            setIsLoading(true)
            api.review.generateTokenReview({ token: location.state.token }).then((res) => {
                const response = JSON.parse(res.data)
                if (response.error)
                    alert(response.error)
                else {
                    setIsLoading(false)
                    setTokenNo(`${response.initials}-${response.tokenNo}`)
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

                {isLoading ? <FullPageSpinner /> :
                    <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                        <Heading m={2} size={"md"}>{doctors.find((doc)=>doc.doctorID==doctor).name}</Heading>
                        <Heading color="crimson" fontSize={'2xl'}>Book a Future Review</Heading>
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={8}>
                            <Stack spacing={4}>

                                <FormControl id="date" isRequired >
                                    <FormLabel >Select date</FormLabel>
                                    <Input value={token.date} onChange={handleDateChange} min={tomorrow} max={maxdate} type="date"></Input>
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
                                {user.userID != 3 ? <FormControl id="reason">
                                    <FormLabel>Select reason</FormLabel>
                                    <RadioGroup name="reason" >
                                        <VStack align={"right"}>
                                            {location?.state.reasons.map((item) => <Radio bg={token.reason == item.reasonID ? "green" : "white"} value={item.reasonID} onChange={handleReasonChange}>{item.name}</Radio>)}
                                            {/* {tokens.length==0 && token.slot!="" ? <Radio value={"W"} onChange={handleTokenChange}>Walk-in token</Radio> : ""} */}
                                        </VStack>
                                    </RadioGroup>
                                </FormControl> : null}
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
