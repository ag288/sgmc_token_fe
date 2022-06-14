
import {

    Box,
    Flex,
    Stack,
    HStack,

    IconButton,

    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    PinInputField,
    Link,
    PinInput
} from '@chakra-ui/react'
import firebase from '../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import api from '../api';
import {
    Timer
} from '../utils/timer'
export const TokenGeneration = () => {
    let navigate = useNavigate()
    const [otp, setOtp] = useState("")
    const [settings, setSettings] = useState("")
    const [state, setState] = useState(false)
    const [patients, setPatients] = useState([])
    const [token, setToken] = useState({
        phone: ""
    })

    useEffect(() => {

        api.settings.checkAvailability().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setSettings(response)
        })

        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                OnSignInSubmit();
            }
        }, auth);

    }, [])


    function handlePhoneChange(e) {
        setToken(prev => ({ ...prev, "phone": e.target.value }))

    }

    const OtpSubmit = (e) => {

        e.preventDefault();

        let code = otp;
        console.log(code)
        window.confirmationResult.confirm(code).then((result) => {
            navigate("/patient-details", { state: { token } })
            alert("Verified successfully!")

        })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                alert(`Verification failed : ${error}`)
                navigate("/book")

            });
    };


    const OnSignInSubmit = (e) => {
        setState(true)
        e.preventDefault()
        if (token.phone == " " || !(token.phone.length == 10)) {
            alert("Please enter a valid phone number")
        }

        else {
            // myContext.setState(true)
            const phoneNumber = '+91' + token.phone;

            console.log(window.recaptchaVerifier)
            const appVerifier = window.recaptchaVerifier;
            const auth = getAuth();
            signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).

                window.confirmationResult = confirmationResult;
                // window.recaptchaVerifier.clear()
                console.log(confirmationResult)
                // ...
            }).catch((error) => {
                console.log(error)
                //window.recaptchaVerifier.clear()
                // Error; SMS not sent
                // ...
            });

        }
    };


    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>

                <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                    {settings != "" ?
                        <Heading size="md">{settings}</Heading>
                        :
                        <>
                            <Heading fontSize={'2xl'}>Book a Token</Heading>
                            <Box
                                rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                width="full"
                                p={8}>
                                {state ? <Stack spacing={0}>
                                    <HStack marginBottom={5}>
                                        <PinInput otp >
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                            <PinInputField onChange={(e) => { setOtp(prev => prev + e.target.value) }} />
                                        </PinInput>
                                    </HStack>
                                    <Timer time="180" setState={setState}/>
                                    <Link align="right" fontSize={14} color={'blue.400'}>Resend OTP</Link>
                                    <Button
                                        type='submit'
                                        id="verify-otp"
                                        onClick={OtpSubmit}
                                        bg={'blue.400'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'blue.500',
                                        }}>
                                        Verify
                                    </Button>
                                </Stack> :
                                    <>
                                        <FormControl id="phone" isRequired >
                                            <FormLabel>Phone number</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon children='91'></InputLeftAddon>
                                                <Input value={token.phone} onChange={handlePhoneChange} type="number" />
                                            </InputGroup>
                                        </FormControl>
                                        <Button
                                            onClick={OnSignInSubmit}
                                            mt={4}
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}>
                                            Send OTP
                                        </Button>
                                    </>
                                }
                            </Box>
                        </>

                    }
                </Stack>
                <Box id="sign-in-button"></Box>
            </Flex>
        </>
    )
}
