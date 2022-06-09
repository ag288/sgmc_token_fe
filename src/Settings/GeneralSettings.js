import { DeleteIcon } from '@chakra-ui/icons'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Flex,
    Stack,
    HStack,
    Tooltip,
    useDisclosure,
    IconButton,
    Text,
    Heading,
    Checkbox,
    filter,
    VStack,
    Input,
    Button,
    FormControl,
    FormLabel,
    List,
    useToast,
    ListItem,
    UnorderedList
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FcCalendar } from 'react-icons/fc'
import api from '../api'



export const GeneralSettings = () => {

    //const [mornlist, setMornList] = useState([])
    const [settings, setSettings] = useState({})
    const toast = useToast()

    useEffect(() => {

        api.settings.fetchSettings().then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })

    }, []);


    function handleChange(e) {
        console.log(e.target.id)
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
            case "5":
                setSettings(prev => ({ ...prev, ["working_start_day"]: e.target.value }));
                break;
            case "6":
                setSettings(prev => ({ ...prev, ["working_end_day"]: e.target.value }));
                break;
            case "7":
                setSettings(prev => ({ ...prev, ["morn_max_tokens"]: e.target.value }));
                break;
            case "8":
                setSettings(prev => ({ ...prev, ["aft_max_tokens"]: e.target.value }));
                break;
            case "9":
                setSettings(prev => ({ ...prev, ["gap"]: e.target.value }));
                break;
            case "10":
                setSettings(prev => ({ ...prev, ["token_start"]: e.target.value }));
                break;
            case "11":
                setSettings(prev => ({ ...prev, ["token_end"]: e.target.value }));
                break;

        }
    }

    function updateSettings() {
        api.settings.updateSettings({ settings }).then((res) => {
            toast({
                title: 'Updated settings successfully',
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        }).catch((err) => {
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



    return (
        <>

       <Box
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        p={8}
                        width='auto'>
                        <Heading size="lg">Settings</Heading>
                        <HStack >
                            <VStack spacing="5%" alignItems={"left"}>
                                <Text>Doctor's working hours for morning slot</Text>
                                <Text>Doctor's working hours for afternoon slot</Text>
                                <Text>Doctor's working days</Text>
                                <Text>Max. number of tokens in the morning slot</Text>
                                <Text>Max. number of tokens in the afternoon slot</Text>
                                <Text>Number of patients remaining before notifying next patient</Text>
                                <Text>Token booking opens at</Text>
                                <Text>Token booking closes at</Text>

                            </VStack>
                            <VStack>
                                <HStack>
                                    <Input type="time" id={"1"} onChange={handleChange} value={settings.working_start_time_1}></Input>
                                    <Text>to</Text>
                                    <Input type="time" id={"2"} onChange={handleChange} value={settings.working_end_time_1}></Input>
                                </HStack>
                                <HStack>
                                    <Input type="time" id={"3"} onChange={handleChange} value={settings.working_start_time_2}></Input>
                                    <Text>to</Text>
                                    <Input type="time" id={"4"} onChange={handleChange} value={settings.working_end_time_2}></Input>
                                </HStack>
                                <HStack>
                                    <Input type="text" id={"5"} onChange={handleChange} value={settings.working_start_day}></Input>
                                    <Text>to</Text>
                                    <Input type="text" id={"6"} onChange={handleChange} value={settings.working_end_day}></Input>
                                </HStack>
                                <Input type="number" id={"7"} onChange={handleChange} value={settings.morn_max_tokens}></Input>
                                <Input type="number" id={"8"} onChange={handleChange} value={settings.aft_max_tokens}></Input>
                                <Input type="number" id={"9"} onChange={handleChange} value={settings.gap}></Input>
                                <Input type="time" id={"10"} onChange={handleChange} value={settings.token_start}></Input>
                                <Input type="time" id={"11"} onChange={handleChange} value={settings.token_end}></Input>
                            </VStack>
                        </HStack>
                        <Box mt="2%" align={"right"}>
                            <Button colorScheme="blue" onClick={updateSettings}>Update Settings</Button>
                        </Box>

                    </Box>
                   
        </>
    )
}
