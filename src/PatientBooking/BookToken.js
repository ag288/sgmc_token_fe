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
import { FaArrowLeft, FaHome, FaMinus, FaMinusCircle, FaPlus } from 'react-icons/fa'
import { useContext, useEffect, useRef, useState } from 'react'
import api from '../api';
import userApi from '../api/user';
import { AppContext } from '../App';
import { FullPageSpinner } from '../components/Spinner';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from '../Reception/HomePage/TokenPrint';

export const BookToken = ({ token, setToken, patientSelect, setPatientSelect }) => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const toast = useToast()
    const [tokens, setTokens] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [reasons, setReasons] = useState([])
    const [settings, setSettings] = useState([])
    const [tokenNo, setTokenNo] = useState("")
    const [time, setTime] = useState({ start: "", end: "" })
    const { isOpen: isOpenGenerate, onOpen: onOpenGenerate, onClose: onCloseGenerate } = useDisclosure()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [doctors, setDoctors] = useState([])



    useEffect(() => {

        api.token.fetchDoctors().then((res) => {
            setDoctors(JSON.parse(res.data).result)
        }).catch((err) => {
            window.alert(err)
        })

    }, [])

    let location = useLocation()

    function handleDoctorChange(e) {

        let doctor = e.target.value
        setToken(prev => ({ ...prev, doctor: doctor }))
        setIsLoading(true)
        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        }).catch(err => {
            setIsLoading(false)
            window.alert(err)

        })

        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        }).catch(err => {
            setIsLoading(false)
            window.alert(err)

        })

        api.book.decideSlots({ doctor }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            console.log(response)
            setSlots(response)
            if (response.length == 0)
                alert("No slots available for booking!")

        }).catch(err => {
            setIsLoading(false)
            window.alert(err)

        })


    }



    function handleTokenChange(item, slotNumber) {
        console.log(item)
        setToken(prev => ({ ...prev, "slot": slotNumber }))
        setToken(prev => ({ ...prev, ...{ "token": item.tokenID, "tokenNumber": item.tokenNumber } }))


    }

    function handleReasonChange(e) {
        if (e.name == "New consultation")
            setToken(prev => ({ ...prev, "reason": e.reasonID, flag: true, limit : 1 }))
        else
            setToken(prev => ({ ...prev, "reason": e.reasonID, flag: false }))
    }


    function goBack() {

        setToken(prev => ({
            ...prev,
            id: "",
            name: "",
            fileNumber: "",
            doctor: "",
            slot: "",
            token: "",
            tokenNumber: "",
            reason: "",
            limit: 1,
            flag: 0
        }))
        setPatientSelect(false)
    }




    function handleSubmit(value) {


        console.log(token)
        if ((token.slot != "" && token.reason != "" && token.token != "")) {
            let finalToken={...token}
            finalToken.arrived = false
           
            setIsLoading(true)
            api.book.generateToken({ token: finalToken, doctors, user: { userID: "whatsapp" } }).then((res) => {
                // localStorage.setItem("patient", JSON.stringify({
                //     name: location.state.token.name ? location.state.token.name : location.state.token.new_name,
                //     fileNumber: location.state.token.fileNumber,
                //     phone: location.state.token.phone,
                //     patientID: location.state.token.id
                // }))
                const response = JSON.parse(res.data)
                console.log(response)
                if (response.message != "") {
                    setIsLoading(false)
                    alert(response.message)
                    navigate("/home")
                }
                else {
                    setIsLoading(false)
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

                        //response.result.status == "arrived" ? setPrintItem(response.result):
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
            }).catch(err => {
                setIsLoading(false)
            })
        }
        else {
            alert("Please fill in all the values")
        }
    }


    return (
        <>
          
                {isLoading ? <FullPageSpinner /> :
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={4}>
                            <Stack spacing={4}>

                                {doctors.length > 0 ? <FormControl>
                                    <FormLabel>Choose doctor</FormLabel>
                                    <Select value={token.doctor} placeholder='Select doctor' onChange={handleDoctorChange}
                                        borderColor="black">
                                        {doctors.map(i => <option value={i.doctorID}>{i.name} ({i.department})</option>)}
                                    </Select>
                                </FormControl> : <Heading size="sm">No doctors available!</Heading>}
                                {token.doctor != "" && <>

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
                                    {slots.length > 0 && <FormControl id="reason">
                                        <FormLabel>Select reason</FormLabel>
                                        <RadioGroup name="reason" >
                                            <VStack align={"right"}>
                                                {reasons.map((item) => <Radio bg={token.reason == item.reasonID ? "green" : "white"}
                                                    value={item.reasonID} onChange={() => handleReasonChange(item)}>{item.name}</Radio>)}
                                            </VStack>
                                        </RadioGroup>
                                    </FormControl>

                                    }
                                </>}
                                <Box align="right">
                                    <Button onClick={goBack}
                                        m={4}
                                        leftIcon={<FaArrowLeft />}
                                        bg={'blue.400'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'blue.500',
                                        }}>
                                        Back</Button>
                                    {slots.length > 0 && token.doctor != "" && <Button
                                        onClick={handleSubmit}
                                        m={4}
                                        bg={'blue.400'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'blue.500',
                                        }}>
                                        Generate Token
                                    </Button>}

                                </Box>
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
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={() => window.location.reload()}>
                                            Ok
                                        </Button>
                                    </ModalFooter>

                                </ModalContent>
                            </Modal>


                        </Box>

                    }
         
        </>
    )
}
