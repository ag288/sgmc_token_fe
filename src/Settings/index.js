import {
    Button,
    Flex,
    IconButton,
    Stack,

} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { GeneralSettings } from './GeneralSettings'
import { Holidays } from './Holidays'
import { FaHome } from 'react-icons/fa'
import { useState } from 'react'


export const Settings = () => {

    let navigate = useNavigate()

    return (
        <>
            <Flex
                bg={"gray.100"}>
                <Stack mx={'auto'} spacing="2%" px={3} width="full">
                    <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>

                    <GeneralSettings />
                    <Holidays />
                </Stack>
            </Flex>
        </>
    )
}
