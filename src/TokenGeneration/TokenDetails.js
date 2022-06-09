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
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FcHome } from 'react-icons/fc'
import { useEffect, useState } from 'react'
import api from '../api';

export const TokenDetails = () => {
    let navigate = useNavigate()
    const [slots, setSlots] = useState([])
    const [reasons, setReasons] = useState([])
    const [token, setToken] = useState({
        slot: "",
        reason: "",
    })
    const [tokenNo, setTokenNo] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        })

        api.settings.decideSlots().then((res) => {
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
        if(token.slot!="" && token.reason!=""){
        location.state.token.slot = token.slot
        location.state.token.reason = token.reason
        location.state.token.id = location.state.id ? location.state.id : location.state.token.id
        console.log(location.state.token)
        api.book.generateToken({ token: location.state.token }).then((res) => {
            const response = JSON.parse(res.data)
            if (response.message != "") {

                alert("All tokens are full for today. Please try again later")
                navigate("/home")
            }
            else {
                setTokenNo(`${response.slot}-${response.tokenNo}`)
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
                <Button m="1%" leftIcon={<FcHome />} colorScheme={"blue"} onClick={() => navigate('/home')}>Home</Button>
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
                                        {slots.map((slot) => <Radio value={slot.slot} onChange={handleSlotChange}>{`${new Date('1970-01-01T' + slot.work_hr_1 + 'Z')
                                            .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.work_hr_2 + 'Z')
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
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Booking successful</ModalHeader>
                                <ModalBody>
                                    { }
                                    <HStack>
                                        <Text>Your token number is </Text> <Text fontWeight={"bold"}>{tokenNo}</Text>
                                    </HStack>
                                    <Text mt="2%">You will be notified around an hour before your estimated time.
                                    </Text>
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
                </Stack>
            </Flex>
        </>
    )
}
