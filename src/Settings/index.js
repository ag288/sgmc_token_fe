import {
    Button,
    Flex,
    Stack,

} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { GeneralSettings } from './GeneralSettings'
import { Holidays } from './Holidays'
import {FcHome} from 'react-icons/fc'
import { useState } from 'react'


export const Settings = () => {
    
    let navigate = useNavigate()

    return (
        <>
            <Flex
                bg={"gray.100"}>
                    <Button m="1%" leftIcon={<FcHome/>} colorScheme={"blue"} onClick={()=>navigate('/home')}>Home</Button>
                <Stack mx={'auto'} spacing="2%" py={12} px={6} width="auto">
                    <GeneralSettings  />
                    <Holidays/>
                </Stack>
            </Flex>
        </>
    )
}
