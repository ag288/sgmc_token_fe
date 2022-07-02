import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AppContext } from '../App';

export default function Login() {

    let navigate = useNavigate()
    const user = useContext(AppContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    function handleUsername(e) {
        setUsername(e.target.value)
    }


    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleSubmit() {
        setIsLoading(true)
        api.user.verifyUser({ username, password }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            console.log(response)
            if (response) {
                localStorage.setItem("currentUser", JSON.stringify(response))
                user.setUser(response)
                navigate("/home")
                // if (response.userID == 1)
                //     navigate("/home")
                // else
                //     navigate("/reception")
            }
            else alert("Incorrect username or password")
        }).catch((err) => {
            alert("An error occured. Please try again")
        })
    }


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={3} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Heading align="center" fontSize={'2xl'}>Sign in</Heading>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl isRequired id="username">
                            <FormLabel>Username</FormLabel>
                            <Input value={username} onChange={handleUsername} type="text" />
                        </FormControl>
                        <FormControl isRequired id="password">
                            <FormLabel>Password</FormLabel>
                            <Input value={password} onChange={handlePassword} type="password" />
                        </FormControl>
                        <Button
                        isLoading={isLoading}
                        //isDisabled={isLoading}
                            type="submit"
                            onClick={handleSubmit}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Sign in
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}