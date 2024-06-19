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
    Switch,
    useToast,
    Table,
    Tr,
    Td,
    Tbody,
    useMediaQuery,
    Grid,
    GridItem,
    Checkbox,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEdit, FaHome, FaMinus, FaPen, FaPlus, FaRegEdit, FaUserEdit } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { FullPageSpinner } from '../components/Spinner';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { ReasonEditModal } from '../Reception/HomePage/ReasonEditModal';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

export const TokenDetailsForReviewChooseToken = () => {
    let navigate = useNavigate()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [slots, setSlots] = useState([])
    const [tokens, setTokens] = useState([])
    const [existingReviews, setExistingReviews] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    let location = useLocation()
    const toast = useToast()
    const [token, setToken] = useState({
        date: "",
        slot: "",
        token: "",
        tokenNumber: "",
        reason: "",
        limit: 1,
        flag: 0,
        procedure: false
    })
    const [tokenNo, setTokenNo] = useState("")
    const [state, setState] = useState(0)  // to re-render when reason is edited
    const [create, setCreate] = useState()
    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
    const [maxdate, setMaxDate] = useState(new Date(today.setDate(today.getDate() + parseInt(location.state?.settings.review_date_limit))).toISOString().split('T')[0])
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenReason, onOpen: onOpenReason, onClose: onCloseReason } = useDisclosure()
    const { user, doctor, doctors } = useContext(AppContext)

    //let maxdate=30
    useEffect(() => {

        //      if (!location.state.origin) {
        setIsLoading(true)
        api.review.reviewExists({ id: location.state.id ? location.state.id : location.state.token.id, doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            setExistingReviews(response)
        })
        //   }
    }, [state]) // re-render when reason is edited


    function handleSlotChange(e) {
        setIsLoading(true)
        setToken(prev => ({ ...prev, "slot": e.target.value }))
        api.review.fetchTokensReview({ slot: e.target.value, date: token.date, doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            setTokens(response)
        })

    }

    function handleTokenChange(slotNumber, item) {


        /*
        setToken(prev => ({ ...prev, "slot": slotNumber }))
        setToken(prev => ({ ...prev, ...{ "token": item.tokenID, "tokenNumber": item.tokenNumber } }))
*/
        let slot = slots.find(i => i.slotNumber == slotNumber)
        if (slot.tokens.length > 0) {
            let tokens = slot.tokens
            setToken(prev => ({ ...prev, "slot": slotNumber }))
            setToken(prev => ({
                ...prev, ...{
                    "token": item.tokenID,
                    "tokenNumber": item.tokenNumber
                }
            }))
        }
    }

    function handleReasonChange(e) {
        if (e.name == "New consultation" && location.state.token.doctor != 1)
            setToken(prev => ({ ...prev, "reason": e.reasonID, flag: true }))
        else
            setToken(prev => ({ ...prev, "reason": e.reasonID, flag: false }))

    }

    function handleDateChange(e) {

        const dateValue = e.target.value
        let flag = 0
        let selectedDate = new Date(`${dateValue} 00:00:00`)
        selectedDate.setHours(0, 0, 0, 0)
        for (var i = 0; i < existingReviews.length; i++) {
            let existingDate = new Date(existingReviews[i].date)
            existingDate.setHours(0, 0, 0, 0)
            if (selectedDate.getTime() == existingDate.getTime()) {
                flag = 1
                break
            }
        }
        let confirm
        if (flag) {
            confirm = window.confirm("There is already a review on the selected date! Do you want to update the existing review?")
        }
        // setIsLoading(true)
        // else {
        if (confirm || !flag) {
            api.review.decideSlotsReview({ date: e.target.value, doctor }).then((res) => {
                //  setIsLoading(false)
                const response = JSON.parse(res.data)
                if (!response.result) {
                    setSlots([])
                    alert(response.message)

                }
                else {
                    setToken(prev => ({ ...prev, "date": dateValue }))
                    setToken(prev => ({ ...prev, slot: "" }))
                    setSlots(response.result)
                    setTokens([])
                }
            })
        }
        else {
            setToken(prev => ({ ...prev, "date": "" }))
        }
    }


    function deleteReview(item) {
        const flag = window.confirm(`Warning!\nYou are going to delete review of ${item.name}`)
        if (flag) {
            setIsLoading(true)
            api.review.deleteReview({ id: item.reviewID }).then((res) => {
                setIsLoading(false)
                setExistingReviews(prev => (prev.filter((review) => review.reviewID != item.reviewID)))
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


    function newReview() {


        setCreate(true)
    }


    function handleSubmit() {

        if (token.slot != "" && token.reason != "" && token.token != "" && token.date != "") {
            location.state.token.slot = token.slot
            location.state.token.date = token.date
            location.state.token.token = token.token
            location.state.token.tokenNumber = token.tokenNumber
            location.state.token.limit = token.limit
            location.state.token.flag = token.flag
            location.state.token.reason = user.userID == 3 ? 1 : token.reason
            location.state.token.id = location.state.id ? location.state.id : location.state.token.id
            location.state.token.creator = user.userID

            setIsLoading(true)
            //  if (create) {
            api.review.generateTokenReview({ token: location.state.token }).then((res) => {
                localStorage.setItem("patient", JSON.stringify({
                    name: location.state.token.name ? location.state.token.name : location.state.token.new_name,
                    fileNumber: location.state.token.fileNumber,
                    phone: location.state.token.phone,
                    patientID: location.state.token.id
                }))
                const response = JSON.parse(res.data)
                if (response.error)
                    alert(response.error)
                else {
                    setIsLoading(false)
                    setTokenNo(`${response.initials}-${response.tokenNo}`)
                    setTime(response.time)
                    onOpen()
                    if (response.noBlockedMsg != "")
                        toast({
                            title: response.noBlockedMsg,
                            status: 'warning',
                            duration: 5000,
                            isClosable: false,
                            position: "top"
                        })
                }

            })
            //   }
        }
        else {
            alert("Please fill in all the values")
        }
    }

    function handleProcedureChange(e) {
        if (location.state.token.doctor != 1)
            setToken(prev => ({ ...prev, "procedure": e.target.checked, flag: e.target.checked }))
        else
            setToken(prev => ({ ...prev, "procedure": e.target.checked }))
    }
    
    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                {/* <IconButton isDisabled={isLoading} size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton> */}

                {isLoading ? <FullPageSpinner /> :
                    <Stack mx={'auto'} spacing="2%" py={12} px={3} width={'auto'}>

                        <Heading mb={2} fontSize={'3xl'}>{doctors.find((doc) => doc.doctorID == doctor).name}</Heading>
                        {/* <Box rounded={'lg'}
                            bg={'orange.100'}
                            boxShadow={'lg'}
                            p={3}
                            width='full'> */}
                        {/* <VStack width="full" alignItems={"baseline"}> */}
                        {existingReviews.length > 0 && <><Heading color="crimson" fontSize={'2xl'}>{`Existing Reviews for ${existingReviews[0]?.name}`}</Heading>

                            {isLaptop && <Table
                                rounded={'lg'}
                                variant="simple"
                                bg={"orange.100"}
                                p={1}>
                                <Tbody>
                                    {existingReviews.map((review) =>
                                        <> <Tr mb={2}>
                                            {/* <HStack width="full" spacing="auto"> */}
                                            <Td size="sm">{`${review.initials}-${review.tokenNumber}`}
                                            </Td>
                                            <Td fontWeight={"bold"}>{new Date(review.date).toDateString()}</Td>
                                            <Td >
                                                <HStack spacing={1}> <Text>{`${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}`}</Text>
                                                    <Text>{`(${review.type})`}</Text>
                                                    <IconButton bg="transparent" onClick={onOpenReason} icon={<FaPen />}></IconButton>
                                                </HStack></Td>
                                            <Td> <IconButton bg="transparent" onClick={() => deleteReview(review)} icon={<DeleteIcon />}></IconButton>
                                            </Td>
                                        </Tr>
                                            <ReasonEditModal setState={setState} item={review} flag={2} isOpen={isOpenReason} onClose={onCloseReason} /></>
                                    )} </Tbody></Table>}

                            {isMobile && existingReviews.map((review) => <Box
                                rounded={'lg'}
                                bg={'orange.100'}
                                width="full"
                            >
                                <HStack width="full" spacing="auto">
                                    <Text size="sm">{`${review.initials}-${review.tokenNumber}`}
                                    </Text>
                                    <Text fontWeight={"bold"}>{new Date(review.date).toDateString()}</Text>
                                    {/* <Text onDoubleClick={onOpenReason}>{`${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })} (${review.type})`}</Text>
                                     */}
                                    <HStack spacing={1}> <Text>{`${new Date(`1970-01-01 ${review.timeInEst}`).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: "numeric" })}`}</Text>
                                        <Text>{`(${review.type})`}</Text>
                                        <IconButton bg="transparent" onClick={onOpenReason} icon={<FaPen />}></IconButton>
                                    </HStack>
                                    <Text> <IconButton bg="transparent" onClick={() => deleteReview(review)} icon={<DeleteIcon />}></IconButton>
                                    </Text>
                                </HStack>   <ReasonEditModal item={review} isOpen={isOpenReason} onClose={onCloseReason} /></Box>
                            )}
                            <Button width="30%" onClick={newReview} colorScheme="blue">Book a review</Button>
                        </>}
                        {existingReviews.length == 0 || create ?
                            <><Heading color="crimson" fontSize={'2xl'}>{"Book Future Review"}</Heading>
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

                                        {slots.map((slot, index) => slot?.tokens?.length > 0 &&
                                            <Box align={"left"} key={index}>



                                                <Text fontWeight="bold"> {slot.start && slot.end ?
                                                    `${new Date('1970-01-01T' + slot.start + 'Z').
                                                        toLocaleTimeString('en-US', {
                                                            timeZone: 'UTC', hour12: true,
                                                            hour: 'numeric', minute: 'numeric'
                                                        })} - ${new Date('1970-01-01T' + slot.end + 'Z').
                                                            toLocaleTimeString('en-US', {
                                                                timeZone: 'UTC', hour12: true,
                                                                hour: 'numeric', minute: 'numeric'
                                                            })}` : "Walk-In Tokens"}</Text>


                                                {isMobile &&
                                                    <RadioGroup>
                                                        <Grid alignItems={"left"} templateRows={'repeat(2, 1fr)'} gap={6} width={"fit-content"}
                                                            templateColumns={'repeat(3, 1fr)'}>

                                                            {slot?.tokens?.length > 0 ?
                                                                slot.tokens.map((item) => <GridItem>
                                                                    <Radio bg={token.token == item.tokenID ? "green" : "white"}
                                                                        value={item.tokenID}
                                                                        onChange={() => handleTokenChange(slot.slotNumber, item)}>
                                                                        {new Date(`1970-01-01 ${item.timeInEst}`).
                                                                            toLocaleTimeString('en-US', {
                                                                                timeZone: 'Asia/Kolkata', hour12: true,
                                                                                hour: 'numeric', minute: 'numeric'
                                                                            })}
                                                                    </Radio>
                                                                </GridItem>)
                                                                : <Text color="red">No tokens available in this slot</Text>}

                                                        </Grid></RadioGroup>}

                                                {isLaptop && <VStack>
                                                    <RadioGroup>
                                                        <HStack spacing={5} alignItems="center">
                                                            {slot?.tokens?.length > 0 ? slot.tokens.map((item) =>
                                                                <Radio bg={token.token == item.tokenID ? "green" : "white"}
                                                                    value={item.tokenID}
                                                                    onChange={() => handleTokenChange(slot.slotNumber, item)}>
                                                                    {new Date(`1970-01-01 ${item.timeInEst}`).
                                                                        toLocaleTimeString('en-US', {
                                                                            timeZone: 'Asia/Kolkata', hour12: true,
                                                                            hour: 'numeric', minute: 'numeric'
                                                                        })}
                                                                </Radio>) :
                                                                <Text color="red">No tokens available in this slot</Text>}
                                                        </HStack>
                                                    </RadioGroup >
                                                </VStack>
                                                }
                                            </Box>
                                        )}


                                        {user.userID != 3 ? <FormControl id="reason">
                                            <FormLabel>Select reason</FormLabel>
                                            <RadioGroup name="reason" >
                                                <VStack align={"right"}>
                                                    {location?.state.reasons.map((item) => <Radio bg={token.reason == item.reasonID ? "green" : "white"} value={item.reasonID}
                                                        onChange={() => handleReasonChange(item)}>{item.name}</Radio>)}
                                                    {/* {tokens.length==0 && token.slot!="" ? <Radio value={"W"} onChange={handleTokenChange}>Walk-in token</Radio> : ""} */}
                                                </VStack>
                                            </RadioGroup>
                                        </FormControl> : null}
                                        <HStack mt={2}>
                                            <Text fontWeight={"bold"}>Procedure</Text>
                                            <Switch
                                                onChange={handleProcedureChange}
                                                isChecked={token.procedure} colorScheme="green" textColor="green"></Switch>
                                        </HStack>
                                        <HStack mt={2}>
                                            <Text fontWeight={"bold"}>Block an extra token</Text>
                                            <Switch onChange={(e) => setToken(prev => ({ ...prev, "flag": e.target.checked }))} 
                                            isDisabled={location.state.token.doctor==1}
                                            isChecked={token.flag} colorScheme="green" textColor="green"></Switch>
                                        </HStack>
                                    </Stack>
                                    <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Booking successful</ModalHeader>
                                            <ModalBody>
                                                {/* <HStack>
                                                    <Text>Your token number is </Text> 
                                                    <Text fontWeight={"bold"}>{tokenNo}</Text>
                                                </HStack> */}
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
                            </> : null}
                    </Stack>}
            </Flex >
        </>
    )
}
