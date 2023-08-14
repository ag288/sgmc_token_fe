
import {
    Box,
    HStack,
    Text,
    Heading,
    VStack,
    Input,
    Button,
    useToast,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    ModalFooter,
    RadioGroup,
    Radio
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'
import api from '../api'
import { AppContext } from '../App'



export const WorkingHourSettings = ({doctor}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({})
    const toast = useToast()
   // console.log(doctor)
    const tokensEnd = new Date(new Date().setHours(20, 0, 0));  // disable update button till 8pm in evening
    const tokensStart = new Date(new Date().setHours(6, 0, 0)); // disable update button after 6am in morning
    const { isOpen, onOpen, onClose } = useDisclosure()
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
   // const {doctor} = useContext(AppContext)

    useEffect(() => {
        api.settings.fetchSettings({doctor : doctor.doctorID}).then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response[0])
            setSettings(response[0])
        })
    }, [doctor]);


    function handleFreqChange(e) {
        setSettings(prev => ({ ...prev, ["working_hr_flag"]: e.target.value }));

    }

    function handleChange(e) {
        switch (e.target.id) {
            case "1":
                setSettings(prev => ({ ...prev, ["working_start_time_1"]: e.target.value }));
                break;
            case "2":
                setSettings(prev => ({ ...prev, ["working_end_time_1"]: e.target.value }));
                break;
            case "3":
                setSettings(prev => ({ ...prev, ["working_start_time_2"]: e.target.value }));
                break;
            case "4":
                setSettings(prev => ({ ...prev, ["working_end_time_2"]: e.target.value }));
                break;

        }
    }

    function updateSettings() {
        onClose()
        setIsLoading(true)
        api.settings.updateHours({ settings, doctor:doctor.doctorID }).then((res) => {
            setIsLoading(false)
            toast({
                title: 'Updated settings successfully',
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
            window.location.reload()
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
            window.location.reload()
        })
    }




    return (
        <>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={3}
                width='full'>
                <Heading size="lg">Working Hours</Heading>
                <VStack width="full">
                    <VStack width="full" alignItems={"baseline"} p={4}>
                        <Text fontWeight={"bold"}>Working hours - Morning</Text>
                        <HStack >
                            <Input type="time" id={"1"} onChange={handleChange} value={settings?.working_start_time_1}></Input>
                            <Text>to</Text>
                            <Input type="time" id={"2"} onChange={handleChange} value={settings?.working_end_time_1}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"}>Working hours - Afternoon</Text>
                        <HStack >
                            <Input type="time" id={"3"} onChange={handleChange} value={settings?.working_start_time_2}></Input>
                            <Text>to</Text>
                            <Input type="time" id={"4"} onChange={handleChange} value={settings?.working_end_time_2}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                </VStack>
                <Box mt="2%" align={"right"}>
                    <Button isLoading={isLoading} colorScheme="blue"  
                    onClick={onOpen}>Update</Button>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text fontWeight={"bold"} mb={2}>Update working hours</Text>
                            <RadioGroup>
                                <VStack alignItems={"baseline"}>
                                    <Radio bg={settings?.working_hr_flag == 1 ? "green" : "white"} onChange={handleFreqChange} value={1}>Only for 1 day</Radio>
                                    <Radio bg={settings?.working_hr_flag == 0 ? "green" : "white"} onChange={handleFreqChange} value={0}>Permanently</Radio>
                                </VStack>
                            </RadioGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={updateSettings}>
                                Ok
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}
