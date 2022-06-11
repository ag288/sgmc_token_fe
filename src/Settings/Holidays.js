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
    UnorderedList
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api'



export const Holidays = () => {
    const [holidays, setHolidays] = useState([])
    const [isLoading, setIsLoading] = useState(false)
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
            setIsLoading(true)
            api.settings.updateHolidays({ date }).then((res) => {
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
                        <Button isLoading={isLoading} colorScheme="blue" onClick={updateHolidays}>Add</Button>
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
                                <IconButton isLoading={isLoading} onClick={() => deleteHoliday(day)} bg="transparent" icon={<DeleteIcon />}></IconButton>
                            </HStack>
                        )}
                    </UnorderedList>
                </Box>
            </Box>
        </>
    )
}
