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
    ModalCloseButton,
    HStack,
    Spinner,
    IconButton,
    useToast,
    CheckboxGroup,
    Checkbox,
    Input,
    Switch,
    useMediaQuery,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaMinus, FaMinusCircle, FaPlus } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import userApi from '../api/user';
import { AppContext } from '../App';
import { FullPageSpinner } from '../components/Spinner';

export const TokenDetailsChooseToken = () => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const toast = useToast()
    const [tokens, setTokens] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { user, doctors, doctor } = useContext(AppContext)
    const [reasons, setReasons] = useState([])
    const [settings, setSettings] = useState([])
    const [token, setToken] = useState({
        slot: "",
        token: "",
        tokenNumber: "",
        reason: "",
        limit: 1,
        flag: 0
    })
    const [tokenNo, setTokenNo] = useState("")
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen: isOpenGenerate, onOpen: onOpenGenerate, onClose: onCloseGenerate } = useDisclosure()
    const { isOpen: isOpenArrival, onOpen: onOpenArrival, onClose: onCloseArrival } = useDisclosure()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])


    useEffect(() => {

        setIsLoading(true)
        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        })

        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })

        api.book.decideSlots({ doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data)
            if (response.result) {
                response.result.push({
                    slotNumber: "W", tokens: [{ tokenID: "A", tokenNumber: "Morning" },
                    { tokenID: "B", tokenNumber: "Evening" }]
                })
                setSlots(response.result)
            }
            else {

            }
        })

    }, [])

    let location = useLocation()

    function handleSlotChange(e) {
        if (e.target.value != "W") {
            setIsLoading(true)
            setToken(prev => ({ ...prev, "slot": e.target.value }))
            api.book.fetchTokens({ slot: e.target.value, doctor, patientID: location.state.id ? location.state.id : location.state.token.id }).then((res) => {
                setIsLoading(false)
                const response = JSON.parse(res.data)
                if (response.result)
                    setTokens(response.result)
                else if (response.message) {
                    setTokens([])
                    alert(response.message)
                    navigate("/home")
                }


            })
        }
        else { // walk in slot
            setToken(prev => ({ ...prev, "flag": 0 })) // extra booking not allowed
            setToken(prev => ({ ...prev, "slot": e.target.value }))
            setTokens([{ "tokenID": 'A', "tokenNumber": "Morning" },
            { "tokenID": 'B', "tokenNumber": "Evening" }])
        }
    }

    function handleTokenChange(item, slotNumber) {
        console.log(item)
        setToken(prev => ({ ...prev, "slot": slotNumber }))
        setToken(prev => ({ ...prev, ...{ "token": item.tokenID, "tokenNumber": item.tokenNumber } }))

        if (slotNumber == "W") {
            setToken(prev => ({ ...prev, "flag": 0 })) // extra booking not allowed

        }


    }

    function handleReasonChange(e) {
        setToken(prev => ({ ...prev, "reason": e.target.value }))
    }

    function setArrived(value) {
        // setToken(prev => ({ ...prev, "arrived": value }))
        onCloseArrival()
        handleSubmit(value)

    }



    function maxToken() {
        let slotsA = slots.filter(item => item.tokens[0].slot == "A").map(el => { return el.slotNumber })
        let slotsB = slots.filter(item => item.tokens[0].slot == "B").map(el => { return el.slotNumber })
        let tokensA = slots.find(item => item.slotNumber == Math.max(...slotsA))?.tokens
        let tokensB = slots.find(item => item.slotNumber == Math.max(...slotsB))?.tokens

        if (tokensA && token.token == Math.max(...tokensA) || tokensB && token.token == Math.max(...tokensB))
            return true
        return false
    }

    function handleSubmit(value) {

        if (user.userID == 3)
            token.reason = 1
        console.log(token)
        if ((token.slot != "" && token.reason != "" && token.token != "")) {
            location.state.token.slot = token.slot
            location.state.token.reason = token.reason
            location.state.token.token = token.token
            location.state.token.tokenNumber = token.tokenNumber
            location.state.token.limit = parseInt(token.limit)
            location.state.token.flag = token.flag
            location.state.token.arrived = value
            location.state.token.id = location.state.id ? location.state.id : location.state.token.id

            setIsLoading(true)
            api.book.generateToken({ token: location.state.token, doctors, user }).then((res) => {
                localStorage.setItem("patient", JSON.stringify({
                    name: location.state.token.name ? location.state.token.name : location.state.token.new_name,
                    fileNumber: location.state.token.fileNumber,
                    phone: location.state.token.phone
                }))
                const response = JSON.parse(res.data)
                if (response.message != "") {
                    setIsLoading(false)
                    alert(response.message)
                    navigate("/home")
                }
                else {
                    setIsLoading(false)
                    if (token.slot != "W") {
                        setTokenNo(`${response.initials}-${response.tokenNo}`)

                        const start = new Date(), end = new Date()

                        if (response.slot == "A" && response.tokenNo == settings.morn_token_start) {
                            const morn = new Date("2022-01-01 " + settings.working_start_time_1);
                            start.setHours(morn.getHours());
                            start.setMinutes(morn.getMinutes() - 15);
                            end.setHours(morn.getHours());
                            end.setMinutes(morn.getMinutes() + 10);
                        }
                        else if (response.slot == "A" && response.tokenNo == settings.morn_token_start + 1) {
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
                        else if (response.slot == "B" && response.tokenNo == settings.aft_token_start + 1) {
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
                        onOpenGenerate()
                        if (response.noBlockedMsg != "")
                            toast({
                                title: response.noBlockedMsg,
                                status: 'warning',
                                duration: 5000,
                                isClosable: false,
                                position: "top"
                            })
                    }

                    else {
                        // setTokenNo(`W${response.initials}-${response.tokenNo}`)
                        console.log(response)
                        toast({
                            title: 'Token generated',
                            status: 'success',
                            duration: 3000,
                            isClosable: false,
                            position: "top"
                        })
                        navigate("/home")
                    }
                }
            }).catch(err => {
                setIsLoading(false)
            })
        }
        else {
            alert("Please fill in all the values")
        }
    }

    function checkWalkIn() {
        if (token.slot == "W") {
            setIsLoading(true)
            api.book.checkWalkIns(location.state.token).then((res) => {
                setIsLoading(false)
                const response = JSON.parse(res.data).message
                if (response == "")
                    onOpenArrival()
                else {
                    let confirm = window.confirm(response)
                    if (confirm)
                        onOpenArrival()
                    else {
                        toast({
                            title: 'Token generation cancelled',
                            status: 'info',
                            duration: 3000,
                            isClosable: false,
                            position: "top"
                        })
                        navigate("/home")
                    }
                }
            }).catch(err => {
                setIsLoading(false)
                alert(err)
            })
        }
        else
            onOpenArrival()
    }

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                {/* <IconButton isDisabled={isLoading} size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton> */}

                {isLoading ? <FullPageSpinner /> :
                    <Stack mx={'auto'} spacing="2%" py={6} px={6} width={'auto'}>
                        <Heading size={"md"}>{doctors.find((doc) => doc.doctorID == doctor).name}</Heading>
                        <Heading fontSize={'2xl'} color="red">Book a Token</Heading>
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={8}>
                            <Stack spacing={4}>
                                {/* <FormControl id="slot" isRequired >
                                    <FormLabel >Select slot</FormLabel>
                                    <RadioGroup name="slot" >
                                        <VStack align={"right"}>
                                            {slots.map((slot) => <Radio bg={token.slot == slot.slotNumber ? "green" : "white"} value={slot.slotNumber} onChange={handleSlotChange}>{`${new Date('1970-01-01T' + slot.start + 'Z')
                                                .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.end + 'Z')
                                                    .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}</Radio>)}
                                            {<Radio value={"W"} onChange={handleSlotChange}>Walk-in token</Radio>}

                                        </VStack>
                                    </RadioGroup>
                                </FormControl>
                                <FormControl id="token" isRequired >
                                    <FormLabel >Select token number</FormLabel>
                                    <RadioGroup name="token" >
                                        <VStack align={"right"}>
                                            {tokens.length > 0 ? tokens.map((item) => <Radio bg={token.token == item.tokenID ? "green" : "white"} value={item.tokenID} onChange={() => handleTokenChange(item)}>{item.tokenNumber}</Radio>)
                                                : <Text color="red">No tokens available in this slot</Text>} </VStack>
                                    </RadioGroup>
                                </FormControl> */}
                                {slots.map((slot, index) => <Box align={"left"} key={index}>

                                    <Box my={index == 0 ? 0 : 4} fontWeight={"bold"}>
                                        {slot.start && slot.end ?
                                            `${new Date('1970-01-01T' + slot.start + 'Z').
                                                toLocaleTimeString('en-US', {
                                                    timeZone: 'UTC', hour12: true,
                                                    hour: 'numeric', minute: 'numeric'
                                                })} - 
                                        ${new Date('1970-01-01T' + slot.end + 'Z').
                                                toLocaleTimeString('en-US', {
                                                    timeZone: 'UTC', hour12: true,
                                                    hour: 'numeric', minute: 'numeric'
                                                })}` : "Walk-In Tokens"}
                                    </Box>
                                    {isMobile &&
                                        <RadioGroup>
                                            <Grid templateRows={'repeat(2, 1fr)'} gap={6} width={"fit-content"}
                                                templateColumns={'repeat(3, 1fr)'}>

                                                {slots[index].tokens.length > 0 ?
                                                    slots[index].tokens.map((item) => <GridItem>
                                                        <Radio bg={token.token == item.tokenID ? "green" : "white"}
                                                            value={item.tokenID}
                                                            onChange={() => handleTokenChange(item, slots[index].slotNumber)}>
                                                            {item.tokenNumber}
                                                        </Radio>
                                                    </GridItem>)
                                                    : <Text color="red">No tokens available in this slot</Text>}

                                            </Grid></RadioGroup>}

                                    {isLaptop && <VStack>
                                        <RadioGroup>
                                            <HStack spacing={5} alignItems="center">
                                                {slots[index].tokens.length > 0 ? slots[index].tokens.map((item) =>
                                                    <Radio bg={token.token == item.tokenID ? "green" : "white"}
                                                        value={item.tokenID}
                                                        onChange={() => handleTokenChange(item, slots[index].slotNumber)}>
                                                        {item.tokenNumber}
                                                    </Radio>) :
                                                    <Text color="red">No tokens available in this slot</Text>}
                                            </HStack>
                                        </RadioGroup >
                                    </VStack>
                                    }
                                </Box>)}
                                <FormControl id="reason">
                                    <FormLabel>Select reason</FormLabel>
                                    <RadioGroup name="reason" >
                                        <VStack align={"right"}>
                                            {reasons.map((item) => <Radio bg={token.reason == item.reasonID ? "green" : "white"} value={item.reasonID} onChange={handleReasonChange}>{item.name}</Radio>)}
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>
                                {/* <FormControl >
                                    <FormLabel>No. of tokens</FormLabel>
                                <HStack>
                                    <IconButton color="red" isDisabled={token.limit==1 || token.slot=="W"} onClick={()=> setToken(prev => ({ ...prev, "limit": prev.limit-1 }))} size="sm" bg="transparent" icon={<FaMinus/>}></IconButton>
                                    <Input borderColor="grey" value={token.limit} width={50} type="number"></Input>
                                       <IconButton isDisabled={token.limit==3 || token.slot=="W"} onClick={()=> setToken(prev => ({ ...prev, "limit": prev.limit+1 }))} color="green" size="sm" bg="transparent" icon={<FaPlus/>}></IconButton>
                                  
                                </HStack>
                                </FormControl> */}
                                {token.slot != "W" /*&& !maxToken()*/ ? <HStack mt={2}>
                                    <Text fontWeight={"bold"}>Block an extra token</Text>
                                    <Switch onChange={(e) => setToken(prev => ({ ...prev, "flag": e.target.checked }))} value={token.flag} colorScheme="green" textColor="green"></Switch>
                                </HStack>
                                    : null}
                            </Stack>
                            <Modal size={"2xl"} isOpen={isOpenGenerate} onClose={onCloseGenerate}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Booking successful</ModalHeader>
                                    <ModalBody>
                                        <HStack>
                                            <Text>Your token number is </Text> <Text fontWeight={"bold"}>{tokenNo}</Text>
                                        </HStack>
                                        <Text mt="2%">Your estimated consultation time is between </Text>
                                        <HStack alignItems={"baseline"}>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(time.start).toLocaleTimeString("en-us", { hour12: true, hour: "numeric", minute: "numeric" })}</Text>
                                            <Text mt="2%">and </Text>
                                            <Text mt="2%" fontWeight={"bold"}>{new Date(time.end).toLocaleTimeString("en-us", { hour12: true, hour: "numeric", minute: "numeric" })}</Text>
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
                            <Modal size={"sm"} isOpen={isOpenArrival} onClose={onCloseArrival}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        Has the patient arrived at the clinic?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={() => setArrived(1)}>
                                            Yes
                                        </Button>
                                        <Button colorScheme='red' mr={3} onClick={() => setArrived(0)}>
                                            No</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <Button
                                onClick={checkWalkIn}
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
            </Flex >
        </>
    )
}
