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



export const Holidays = () => {
    const [settings, setSettings] = useState({})
    const [holidays, setHolidays] = useState([])
    const [date, setDate] = useState("")
    const toast = useToast()

    useEffect(() => {

        api.settings.fetchHolidays().then((res) => {
            const response = JSON.parse(res.data).result
            setHolidays(response)
        })

    }, []);




    function updateHolidays() {
        if (date != "") {
            api.settings.updateHolidays({ date }).then((res) => {
                setHolidays(prev => ([...prev, { "date": new Date(date) }]))
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
    }


    function deleteHoliday(day) {
        api.settings.deleteHolidays({ date: day.date }).then((res) => {
            setHolidays(holidays.filter(item => item.date != day))
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
                        <Button colorScheme="blue" onClick={updateHolidays}>Add</Button>
                    </Box>
                </HStack>
                <Box rounded={'lg'}
                    bg={'gray.300'}
                    boxShadow={'lg'}
                    p={8}
                    m={4}
                    width='auto'>
                    <Heading mb={"2%"} fontWeight={"extrabold"} size="md">List of Holidays</Heading>
                    <UnorderedList >
                        {holidays.map((day) =>
                            <HStack width="30%" spacing="auto" alignItems={"baseline"}>
                                <ListItem mb="2%" fontWeight={"bold"}>{new Date(day.date).toDateString()}</ListItem>
                                <IconButton onClick={() => deleteHoliday(day)} bg="transparent" icon={<DeleteIcon />}></IconButton>
                            </HStack>
                        )}
                    </UnorderedList>
                </Box>
            </Box>
        </>
    )
}
