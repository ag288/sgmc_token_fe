
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
    Switch,
    InputGroup,
    InputRightAddon
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'
import api from '../api'
import { AppContext } from '../App'



export const GeneralSettings = ({ doctor }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({})
    // const [max, setMax] = useState([])
    const toast = useToast()
    const tokensEnd = new Date(new Date().setHours(20, 0, 0));  // disable update settings button till 8pm in evening
    const tokensStart = new Date(new Date().setHours(6, 0, 0)); // disable update settings button after 6am in morning
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    //  const { doctor } = useContext(AppContext)
    useEffect(() => {

        api.settings.fetchSettings({ doctor: doctor.doctorID }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
        //setSettings(setting)
        // api.token.fetchLastToken().then((res) => {
        //     const response = JSON.parse(res.data).result
        //     console.log(response)
        //     setMax(response)
        //     if (response.length == 0)
        //         setMax([{ slot: "A", tokenNumber: 0 }, { slot: "B", tokenNumber: 0 }])
        //     else if (response.length == 1) {
        //         if (response[0].slot == "A")
        //             setMax(prev => ([...prev, { slot: "B", tokenNumber: 0 }]))
        //         else
        //             setMax(prev => ([...prev, { slot: "A", tokenNumber: 0 }]))
        //     }
        //     //  console.log()
        // })

    }, [doctor]);


    function handleChange(e) {
        switch (e.target.id) {

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
            case "15":
                setSettings(prev => ({ ...prev, ["delay_minutes"]: e.target.value }));
                break;
            case "16":
                setSettings(prev => ({ ...prev, ["delay_count"]: e.target.value }));
                break;
            case "17":
                setSettings(prev => ({ ...prev, ["enableReview"]: e.target.checked }));
                break;
            case "18":
                setSettings(prev => ({ ...prev, ["autocall"]: e.target.checked }));
                break;
            case "19":
                setSettings(prev => ({ ...prev, ["future_booking_start"]: e.target.value }));
                break;
            case "20":
                setSettings(prev => ({ ...prev, ["enableWhatsapp"]: e.target.checked }));
                break;
            case "21":
                setSettings(prev => ({ ...prev, ["enableSms"]: e.target.checked }));
                break;
            case "21":
                setSettings(prev => ({ ...prev, ["walkin_max"]: e.target.value }));
                break;
        }
    }

    function updateSettings() {
        // if (settings.morn_max_tokens < max.find(item => item.slot == "A").tokenNumber)
        //     alert("Please enter the correct value for maximum morning tokens!")
        // else if (settings.aft_max_tokens < max.find(item => item.slot == "B").tokenNumber)
        //     alert("Please enter the correct value for maximum afternoon tokens!")
        // else {
        setIsLoading(true)
        api.settings.updateSettings({ settings, doctor: doctor.doctorID }).then((res) => {
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
        //  }
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

                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Working days</Text>
                        <HStack >
                            <Input type="text" id={"5"} onChange={handleChange} value={settings?.working_start_day}></Input>
                            <Text>to</Text>
                            <Input type="text" id={"6"} onChange={handleChange} value={settings?.working_end_day}></Input>
                        </HStack>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
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
                        <Text fontWeight={"bold"} >Future token booking opens at</Text>
                        <Input type="time" id={"19"} onChange={handleChange} value={settings?.future_booking_start}></Input>
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
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Set as delayed after</Text>
                        <InputGroup>
                            <Input type="number" id={"15"} onChange={handleChange} value={settings?.delay_minutes}></Input>
                            <InputRightAddon children="minutes" />
                        </InputGroup>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <VStack p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Set as delayed if there are less than</Text>
                        <InputGroup>
                            <Input type="number" id={"16"} onChange={handleChange} value={settings?.delay_count}></Input>
                            <InputRightAddon children="waiting tokens" />
                        </InputGroup>
                    </VStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <HStack spacing="auto" p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Add review as days</Text>
                        <Switch id={"17"} onChange={handleChange} isChecked={settings?.enableReview}></Switch>
                    </HStack>
                    {/*<Divider borderColor={"gray"} orientation='horizontal' />
                    <HStack spacing="auto" p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Automatically call next token</Text>
                        <Switch id={"18"} onChange={handleChange} isChecked={settings?.autocall}></Switch>
                    </HStack> */}
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <HStack spacing="auto" p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Enable booking through whatsapp</Text>
                        <Switch id={"20"} onChange={handleChange} isChecked={settings?.enableWhatsapp}></Switch>
                    </HStack>
                    <Divider borderColor={"gray"} orientation='horizontal' />
                    <HStack spacing="auto" p={4} width="full" alignItems={"baseline"}>
                        <Text fontWeight={"bold"} >Enable SMS service</Text>
                        <Switch id={"21"} onChange={handleChange} isChecked={settings?.enableSms}></Switch>
                    </HStack>
                </VStack>
                <Divider borderColor={"gray"} orientation='horizontal' />
                <VStack p={4} width="full" alignItems={"baseline"}>
                    <Text fontWeight={"bold"} >Maximum number of walk-in tokens</Text>
                    <Input type="number" id={"22"} onChange={handleChange} value={settings?.walkin_max}></Input>
                </VStack>
                <Divider borderColor={"gray"} orientation='horizontal' />
                <Box mt="2%" align={"right"}>
                    {/* isDisabled={!(today.getTime() > tokensEnd.getTime() || today.getTime() < tokensStart.getTime())} */}
                    <Button isLoading={isLoading} colorScheme="blue" isDisabled={!(today.getTime() > tokensEnd.getTime() || today.getTime() < tokensStart.getTime())} onClick={updateSettings}>Update Settings</Button>
                </Box>
            </Box>
        </>
    )
}
