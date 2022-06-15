
import {

    Box,
    Flex,
    Stack,

    Heading,

    Input,
    Button,
    FormControl,
    FormLabel,

    Select,
    IconButton,
    useToast,
    Textarea,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import api from '../api';

export const SendMessage = () => {

    const [body, setBody] = useState("")
    const [phone, setPhone] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    function handleBodyChange(e) {
        setBody(e.target.value)
    }

    function handlePhoneChange(e) {
        setPhone(e.target.value)
    }

    function handleTypeChange(e) {
        if (e.target.value == "Welcome message") {
            setBody(`This chat is for taking tokens for consultation with *Dr. Thomas M. George (Orthopedics)*.\n\nFor token-related queries, please call 9061901441. For any other queries please contact the clinic at 0471-4011441.\n\nTokens can be taken only for today, ${new Date().toDateString()} from 7:00 AM.\n\nPlease click the button below to start booking.`)
        }
        else setBody("")
    }
    function handleSubmit() {
        setIsLoading(true)
        api.token.invitePatient({ phone, body }).then((res) => {
            setIsLoading(false)
            toast({
                title: 'Message sent successfully',
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        }).catch(() => {
            toast({
                title: 'An error occurred',
                status: "error",
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        })
    }

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
                <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                    <Heading fontSize={'2xl'}>Invite a Patient</Heading>
                    <Box
                        rounded={'lg'}
                        bg={'white'}
                        boxShadow={'lg'}
                        width="full"
                        p={8}>
                        <Stack spacing={4}>
                            <form onSubmit={handleSubmit}>
                                <FormControl id="phone" isRequired >
                                    <FormLabel>Phone number</FormLabel>
                                    <Input value={phone} onChange={handlePhoneChange} type="number"></Input>
                                </FormControl>

                                <FormControl id="type" isRequired >
                                    <FormLabel>Message Type</FormLabel>
                                    <Select onChange={handleTypeChange} placeholder="select message type">
                                        <option>Custom message</option>
                                        <option>Welcome message</option>
                                    </Select>
                                </FormControl>

                                <FormControl id="body" isRequired >
                                    <FormLabel>Body</FormLabel>
                                    <Textarea value={body} onChange={handleBodyChange} />
                                </FormControl>
                                <Button
                                    type={"submit"}
                                    //  onClick={handleSubmit}
                                    mt={4}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Send message
                                </Button>
                            </form>

                        </Stack>

                    </Box>
                </Stack>
            </Flex>
        </>
    )
}
