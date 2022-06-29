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
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import api from '../api';
import { FullPageSpinner } from '../utils/spinner';

export const TokenDetails = () => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [reasons, setReasons] = useState([])
    const [settings, setSettings] = useState([])
    const [token, setToken] = useState({
        slot: "",
        reason: ""
    })
    const [tokenNo, setTokenNo] = useState("")
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        })

        api.settings.fetchSettings().then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })

        api.book.decideSlots().then((res) => {
            const response = JSON.parse(res.data).result
            setSlots(response)
        })

    }, [])

    let location = useLocation()

    function handleSlotChange(e) {
        console.log(e.target.value)
        setToken(prev => ({ ...prev, "slot": e.target.value }))
     

    }


    function handleReasonChange(e) {
        setToken(prev => ({ ...prev, "reason": e.target.value }))

    }

   

    function handleSubmit() {
        if (token.slot != "" && token.reason != "") {
            location.state.token.slot = token.slot
            location.state.token.reason = token.reason
            location.state.token.id = location.state.id ? location.state.id : location.state.token.id
            setIsLoading(true)
            api.book.generateToken({ token: location.state.token }).then((res) => {
                const response = JSON.parse(res.data)
                if (response.message != "") {
                    setIsLoading(false)
                    alert("All tokens are full for today. Please try again later")
                    navigate("/home")
                }
                else {
                    setIsLoading(false)
                    setTokenNo(`${response.slot}-${response.tokenNo}`)
                    const start = new Date(), end = new Date()
                    console.log(response.time)
                    if (response.slot == "A" && response.tokenNo == settings.morn_token_start) {
                        const morn = new Date("2022-01-01 " + settings.working_start_time_1);
                        start.setHours(morn.getHours());
                        start.setMinutes(morn.getMinutes() - 15);
                        end.setHours(morn.getHours());
                        end.setMinutes(morn.getMinutes() + 10);
                    }
                    else if (response.slot == "A" && response.tokenNo == settings.morn_token_start+1) {
                        const morn = new Date("2022-01-01 " + settings.working_start_time_1);
                        start.setHours(morn.getHours());
                        start.setMinutes(morn.getMinutes() - 15);
                        end.setHours(morn.getHours());
                        end.setMinutes(morn.getMinutes() + 30);
                    }
                    else if (response.slot == "B" && response.tokenNo == settings.aft_token_start) {
                        const morn = new Date("2022-01-01 " + settings.working_start_time_2);
                        start.setHours(morn.getHours());
                        start.setMinutes(morn.getMinutes() - 15);
                        end.setHours(morn.getHours());
                        end.setMinutes(morn.getMinutes() + 10);
                    }
                    else if (response.slot == "B" && response.tokenNo == settings.aft_token_start+1) {
                        const morn = new Date("2022-01-01 " + settings.working_start_time_2);
                        start.setHours(morn.getHours());
                        start.setMinutes(morn.getMinutes() - 15);
                        end.setHours(morn.getHours());
                        end.setMinutes(morn.getMinutes() + 30);
                    }
                    else {
                        var coeff = 1000 * 60 * 5;
                        console.log(new Date(response.time))
                        var rounded = new Date(Math.round(new Date(response.time) / coeff) * coeff)
                        console.log(Math.round(new Date(response.time) / coeff) * coeff)
                        start.setHours(rounded.getHours())
                        start.setMinutes(rounded.getMinutes() - 15)
                        end.setHours(rounded.getHours())
                        end.setMinutes(rounded.getMinutes() + 15)
                    }
                    setTime({ start: start, end: end })
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

               {isLoading ? <FullPageSpinner/> :
                    <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                        <Heading fontSize={'2xl'}>Book a Token</Heading>
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={8}>
                            <Stack spacing={4}>
                                <FormControl id="slot" isRequired >
                                    <FormLabel >Select slot</FormLabel>
                                    <RadioGroup name="slot" >
                                        <VStack align={"right"}>
                                            {slots.map((slot) => <Radio bg={token.slot==slot.slotNumber ? "green":"white"} value={slot.slotNumber} onChange={handleSlotChange}>{`${new Date('1970-01-01T' + slot.start + 'Z')
                                                .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.end + 'Z')
                                                    .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}</Radio>)}
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>

                               
                                <FormControl id="reason">
                                    <FormLabel>Select reason</FormLabel>
                                    <Select placeholder='Select reason for visit' onChange={handleReasonChange}>
                                        {reasons.map(reason =>
                                            <option value={reason.reasonID}>{reason.name}</option>
                                        )}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Booking successful</ModalHeader>
                                    <ModalBody>
                                        <HStack>
                                            <Text>Your token number is </Text> <Text fontWeight={"bold"}>{tokenNo}</Text>
                                        </HStack>
                                            <Text mt="2%">Your estimated consultation time is between </Text>
                                            <HStack alignItems={"baseline"}>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(time.start).toLocaleTimeString("en-us",{hour12:true,hour:"numeric",minute:"numeric"})}</Text>
                                            <Text mt="2%">and </Text>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(time.end).toLocaleTimeString("en-us",{hour12:true,hour:"numeric",minute:"numeric"})}</Text>
                                            </HStack>
                                        <Text mt="2%"> Send 'status' to 9061901441 to know the status of your token.</Text>
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
                                Generate Token
                            </Button>
                        </Box>
                    </Stack>}
            </Flex>
        </>
    )
}
