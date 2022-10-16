
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
    Radio,
    Switch,
    Checkbox,
    Center
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'
import api from '../api'
import { AppContext } from '../App'



export const KillSwitchSettings = ({ doctor }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({})
    const [killedSlot, setKilledSlot] = useState({ morning: null, evening: null })
    const toast = useToast()
    // console.log(doctor)
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const {doctor} = useContext(AppContext)

    useEffect(() => {
        api.settings.fetchSettings({ doctor: doctor.doctorID }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
            if (response[0].killed) {
                if (response[0].killed.includes("A") && response[0].killed.includes("B"))
                    setKilledSlot({ morning: "A", evening: "B" })
                else if (response[0].killed.includes("A")) {
                    setKilledSlot(prev => ({ ...prev, ["morning"]: "A" }))
                }
                else if (response[0].killed.includes("B")) {
                    setKilledSlot(prev => ({ ...prev, ["evening"]: "B" }))
                }
            }
        })
    }, [doctor]);



    function handleChange(e) {

        switch (e.target.id) {
            case "1":
                setSettings(prev => ({ ...prev, ["globalKill"]: e.target.checked }));
                if (e.target.checked) {
                    setKilledSlot({ morning: null, evening: null });
                }
                break;
            case "2":
                if (e.target.checked) {
                    setKilledSlot(prev => ({ ...prev, ["morning"]: e.target.value }));
                }
                else {
                    setKilledSlot(prev => ({ ...prev, ["morning"]: null }));
                }

                break;
            case "3":
                if (e.target.checked) {
                    setKilledSlot(prev => ({ ...prev, ["evening"]: e.target.value }));
                }
                else {
                    setKilledSlot(prev => ({ ...prev, ["evening"]: null }));
                }
                break;

        }
    }

    function updateSettings() {
        //  onClose()
        setIsLoading(true)
        let kill = ""
        if (!killedSlot.morning && !killedSlot.evening)
            kill = null
        else {
            if (killedSlot.morning)
                kill += killedSlot.morning
            if (killedSlot.evening)
                kill += killedSlot.evening
        }
        console.log(kill)
        api.settings.updateKill({ globalKill: settings.globalKill, kill, doctor: doctor.doctorID }).then((res) => {
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
                <Heading size="lg">Block Tokens</Heading>
                <VStack width="full">
                    <VStack width="full" alignItems={"baseline"} p={4}>

                        <HStack spacing="auto" p={2} width="full" alignItems={"baseline"}>
                            <Text fontWeight={"bold"} >{`Morning (${new Date().toDateString()})`}</Text>
                            <Switch id={"2"} value="A" isDisabled={settings.globalKill} onChange={handleChange} isChecked={killedSlot.morning && killedSlot.morning.includes("A")}></Switch>
                        </HStack>
                        <HStack spacing="auto" p={2} width="full" alignItems={"baseline"}>
                            <Text fontWeight={"bold"} >{`Evening (${new Date().toDateString()})`}</Text>
                            <Switch id={"3"} value="B" isDisabled={settings.globalKill} onChange={handleChange} isChecked={killedSlot.evening && killedSlot.evening.includes("B")}></Switch>
                        </HStack>
                        <Box width="full" >
                            <Center>
                                <Heading align="center" size="md">OR</Heading>
                            </Center>
                        </Box>
                        <HStack spacing="auto" p={2} width="full" alignItems={"baseline"}>
                            <Checkbox id={"1"} value="A" onChange={handleChange} isChecked={settings.globalKill}>Block whatsapp tokens till further notice</Checkbox>
                        </HStack>
                    </VStack>
                </VStack>
                <Box mt="2%" align={"right"}>
                    <Button isLoading={isLoading} colorScheme="blue" onClick={updateSettings}>Update</Button>
                </Box>

            </Box>
        </>
    )
}
