import React, { useState } from 'react';
import {
    HStack,
    PinInput,
    PinInputField,
    Link,
    Stack,
    Button,
} from '@chakra-ui/react';
import firebase from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
//import { Timer } from '../../utils/timer';


//field to enter the recieved otp

export const OTPEntryField = () => {

    const [otp, setOtp] = useState("")
    let navigate = useNavigate()

    const OtpSubmit = (e) => {

        e.preventDefault();

        let code = otp;
        console.log(code)
        window.confirmationResult.confirm(code).then((result) => {
            navigate("/patient-details")
            alert("Verified successfully!")

        })
            .catch((error) => {
                // User couldn't sign in (bad verification code?)
                alert(`Verification failed : ${error}`)
              navigate("/book")

            });
    };

    return (
        <Stack spacing={0}>
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
            {/* <Timer time="40" /> */}
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
        </Stack>
    )

}
