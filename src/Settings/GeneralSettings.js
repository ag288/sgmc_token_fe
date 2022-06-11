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
    UnorderedList,
    Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FcCalendar } from 'react-icons/fc'
import api from '../api'



export const GeneralSettings = () => {

    const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
        api.settings.updateSettings({ settings }).then((res) => {
            setIsLoading(false)
            toast({
                title: 'Updated settings successfully',
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
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



    return (
        <>

            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}
                width='full'>
                <Heading size="lg">Settings</Heading>
                <VStack width="full">
                    <VStack width="full" alignItems={"baseline"} m={2}>
                        <Text mt="2%" fontWeight={"bold"}>Working hours - Morning</Text>
                        <HStack >
                            <Input type="time" id={"1"} onChange={handleChange} value={settings.working_start_time_1}></Input>
                            <Text>to</Text>
                            <Input type="time" id={"2"} onChange={handleChange} value={settings.working_end_time_1}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"}>Working hours - Afternoon</Text>
                        <HStack >
                            <Input type="time" id={"3"} onChange={handleChange} value={settings.working_start_time_2}></Input>
                            <Text>to</Text>
                            <Input type="time" id={"4"} onChange={handleChange} value={settings.working_end_time_2}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4}  width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Working days</Text>
                        <HStack >
                            <Input type="text" id={"5"} onChange={handleChange} value={settings.working_start_day}></Input>
                            <Text>to</Text>
                            <Input type="text" id={"6"} onChange={handleChange} value={settings.working_end_day}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack  p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Maximum tokens - Morning</Text>
                        <Input type="number" id={"7"} onChange={handleChange} value={settings.morn_max_tokens}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Maximum tokens - Afternoon</Text>
                        <Input type="number" id={"8"} onChange={handleChange} value={settings.aft_max_tokens}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Notify before</Text>
                        <Input type="number" id={"9"} onChange={handleChange} value={settings.gap}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Token booking opens at</Text>
                        <Input type="time" id={"10"} onChange={handleChange} value={settings.token_start}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal'/>
                    <VStack p={4} width="full"  alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Token booking closes at</Text>
                        <Input type="time" id={"11"} onChange={handleChange} value={settings.token_end}></Input>
                    </VStack>
                </VStack>
                <Divider borderColor={"gray"} orientation='horizontal'/>
                <Box mt="2%" align={"right"}>
                    <Button isLoading={isLoading} colorScheme="blue" onClick={updateSettings}>Update Settings</Button>
                </Box>

            </Box>

        </>
    )
}
