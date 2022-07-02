import { DeleteIcon } from '@chakra-ui/icons'
import {
    Box,
    HStack,
    IconButton,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    useToast,
    ListItem,
    UnorderedList,
    Radio,
    RadioGroup,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useDisclosure,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api'
import { FullPageSpinner } from '../utils/spinner'



export const Holidays = () => {
    const [holidays, setHolidays] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGeneralHoliday, setIsGeneralHoliday] = useState("")
    const [date, setDate] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [holidayInfo, setHolidayInfo]= useState({
        isGeneralHoliday : "",
        duration : "",
        slot : ""
    })
    const toast = useToast()

    useEffect(() => {

        api.settings.fetchHolidays().then((res) => {
            const response = JSON.parse(res.data).result
            setHolidays(response)
        })

    }, []);


    function chooseType() {
        onOpen()
    }

    function handleTypeChange(e) {
        setHolidayInfo(prev=>({...prev, "isGeneralHoliday":e.target.value}))
    }
    function handleDurationChange(e) {
        setHolidayInfo(prev=>({...prev, "duration":e.target.value}))
    }
    function handleSlotChange(e) {
        setHolidayInfo(prev=>({...prev, "slot":e.target.value}))
    }

    function updateHolidays() {
        onClose()
        if (date!= "" && holidayInfo.isGeneralHoliday!="")  {
            setIsLoading(true)
            api.settings.updateHolidays({ date, holidayInfo }).then((res) => {
                setIsLoading(false)
                setHolidays(prev => ([...prev, { "date": new Date(date) }]))
            }).catch((err) => {
                setIsLoading(false)
                toast({
                    title: 'An error occured.',
                    description: 'Please try again later',
                    status: 'error',
                    duration: 3000,
                    isClosable: false,
                    position: "top"
                })
            })
        }
    }


    function deleteHoliday(day) {
        setIsLoading(true)
        api.settings.deleteHolidays({ date: day.date }).then((res) => {
            setIsLoading(false)
            setHolidays(holidays.filter(item => item.date != day.date))
        }).catch((err) => {
            setIsLoading(false)
            toast({
                title: 'An error occured.',
                description: 'Please try again later',
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        })
    }


    function holidayChange(e) {
        setDate(e.target.value)
        //setHolidays(prev => ([...prev, { "date": new Date(e.target.value) }]))
        //setNewHolidays(prev => ([...prev, new Date(e.target.value)]))
    }


    return (
        <>


            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}

                width='auto'>
                <Heading size="lg" mb="3%">Holidays</Heading>
                <HStack alignItems={"end"} m={4}>
                    <Box align="center" >
                        <Box align="center">
                            <FormControl>
                                <FormLabel>Select holiday</FormLabel>
                                <Input borderColor={"grey"} onChange={holidayChange} min={new Date().toISOString().split('T')[0]} value={date} type="date" ></Input>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box mt="2%" align={"right"}>
                        <Button isDisabled={isLoading} colorScheme="blue" onClick={chooseType}>Add</Button>
                    </Box>
                </HStack>
               {isLoading? <FullPageSpinner/> : <Box rounded={'lg'}
                    bg={'gray.300'}
                    boxShadow={'lg'}
                    p={8}
                    m={4}
                    width='auto'>
                    <Heading mb={"2%"} fontWeight={"extrabold"} size="md">List of Holidays</Heading>
                    <UnorderedList >
                        {holidays.map((day) =>
                            <HStack width="50%" spacing="auto" alignItems={"baseline"}>
                                <ListItem mb="2%" fontWeight={"bold"}>{new Date(day.date).toDateString()}</ListItem>

                                <IconButton isDisabled={isLoading} onClick={() => deleteHoliday(day)} bg="transparent" icon={<DeleteIcon />}></IconButton>

                            </HStack>
                        )}
                    </UnorderedList>
                </Box>}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Choose leave type</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                        <FormControl mt={5}><FormLabel>Choose leave duration</FormLabel>
                                <RadioGroup>
                                    <HStack>
                                        <Radio onChange={handleTypeChange} value={"true"}>Clinic holiday</Radio>
                                        <Radio onChange={handleTypeChange} value={"false"}>Doctor leave</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                            {/* <FormControl mt={5}><FormLabel>Choose leave duration</FormLabel>
                                <RadioGroup>
                                    <HStack>
                                        <Radio onChange={handleDurationChange} value={"H"}>Half Day</Radio>
                                        <Radio onChange={handleDurationChange} value={"F"}>Full Day</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                          { holidayInfo.duration=="H" && <FormControl mt={5}><FormLabel>Choose leave slot</FormLabel>
                                <RadioGroup>
                                    <HStack>
                                        <Radio onChange={handleSlotChange} value={"A"}>Morning</Radio>
                                        <Radio onChange={handleSlotChange} value={"B"}>Evening</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>} */}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={updateHolidays}>Ok</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}
