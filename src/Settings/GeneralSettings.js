
import {
    Box,
    HStack,
    Text,
    Heading,
    VStack,
    Input,
    Button,
    useToast,
    Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'
import api from '../api'



export const GeneralSettings = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({})
    const [max, setMax] = useState([])
    const toast = useToast()
    const tokensEnd = new Date(new Date().setHours(20, 0, 0));  // disable update settings button till 8pm in evening
    const tokensStart = new Date(new Date().setHours(6, 0, 0)); // disable update settings button after 6am in morning


    useEffect(() => {

        api.settings.fetchSettings().then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
        //setSettings(setting)
        api.token.fetchLastToken().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setMax(response)
            if (response.length == 0)
                setMax([{ slot: "A", tokenNumber: 0 }, { slot: "B", tokenNumber: 0 }])
            else if (response.length == 1) {
                if (response[0].slot == "A")
                    setMax(prev => ([...prev, { slot: "B", tokenNumber: 0 }]))
                else
                    setMax(prev => ([...prev, { slot: "A", tokenNumber: 0 }]))
            }
            //  console.log()
        })

    }, []);


    function handleChange(e) {
        switch (e.target.id) {
            // case "1":
            //     setSettings(prev => ({ ...prev, ["working_start_time_1"]: e.target.value }));
            //     break;
            // case "2":
            //     setSettings(prev => ({ ...prev, ["working_end_time_1"]: e.target.value }));
            //     break;
            // case "3":
            //     setSettings(prev => ({ ...prev, ["working_start_time_2"]: e.target.value }));
            //     break;
            // case "4":
            //     setSettings(prev => ({ ...prev, ["working_end_time_2"]: e.target.value }));
            //     break;
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
            case "12":
                setSettings(prev => ({ ...prev, ["morn_token_start"]: e.target.value }));
                break;
            case "13":
                setSettings(prev => ({ ...prev, ["aft_token_start"]: e.target.value }));
                break;
            case "14":
                setSettings(prev => ({ ...prev, ["review_date_limit"]: e.target.value }));
                break;

        }
    }

    function updateSettings() {
        if (settings.morn_max_tokens < max.find(item => item.slot == "A").tokenNumber)
            alert("Please enter the correct value for maximum morning tokens!")
        else if (settings.aft_max_tokens < max.find(item => item.slot == "B").tokenNumber)
            alert("Please enter the correct value for maximum afternoon tokens!")
        else {
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
                    {/* <VStack width="full" alignItems={"baseline"} p={4}>
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
                    <Divider borderColor={"gray"} orientation='horizontal' />*/}
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Working days</Text>
                        <HStack >
                            <Input type="text" id={"5"} onChange={handleChange} value={settings?.working_start_day}></Input>
                            <Text>to</Text>
                            <Input type="text" id={"6"} onChange={handleChange} value={settings?.working_end_day}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    {/* <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Maximum tokens - Morning</Text>
                        <Input type="number" id={"7"} onChange={handleChange} value={settings?.morn_max_tokens}></Input>
                        {max.find(item => item.slot == "A") ? <Text color="red">{`(Cannot be less than ${max.find(item => item.slot == "A").tokenNumber})`}</Text>
                            : null}
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Maximum tokens - Afternoon</Text>
                        <Input type="number" id={"8"} onChange={handleChange} value={settings?.aft_max_tokens}></Input>
                        {max.find(item => item.slot == "B") ? <Text color="red">{`(Cannot be less than ${max.find(item => item.slot == "B").tokenNumber})`}</Text>
                            : null}
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' /> */}
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Notify before</Text>
                        <Input type="number" id={"9"} onChange={handleChange} value={settings?.gap}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Token booking opens at</Text>
                        <Input type="time" id={"10"} onChange={handleChange} value={settings?.token_start}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Token booking closes at</Text>
                        <Input type="time" id={"11"} onChange={handleChange} value={settings?.token_end}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Morning tokens start from</Text>
                        <Input type="number" id={"12"} onChange={handleChange} value={settings?.morn_token_start}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Evening tokens start from</Text>
                        <Input type="number" id={"13"} onChange={handleChange} value={settings?.aft_token_start}></Input>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Days upto which reviews can be booked</Text>
                        <Input type="number" id={"14"} onChange={handleChange} value={settings?.review_date_limit}></Input>
                    </VStack>
                </VStack>
                <Divider borderColor={"gray"} orientation='horizontal' />
                <Box mt="2%" align={"right"}>
                {/* isDisabled={new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getTime() < tokensEnd.getTime()} */}
                    <Button isLoading={isLoading}  colorScheme="blue" onClick={updateSettings}>Update Settings</Button>
                </Box>
            </Box>
        </>
    )
}
