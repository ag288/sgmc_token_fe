import {
    Flex,
    IconButton,
    Stack,
Box, Select
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { GeneralSettings } from './GeneralSettings'
import { Holidays } from './Holidays'
import { FaHome } from 'react-icons/fa'
import { TokenTypes } from './TokenTypes'
import { WorkingHourSettings } from './WorkingHourSettings'
import api from '../api'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'


export const Settings = () => {

    let navigate = useNavigate()
    const {doctor,doctors, setDoctor} = useContext(AppContext)

    function handleChange(e){
        setDoctor(e.target.value)
        localStorage.setItem("doctor", e.target.value)
    }
    return (
        <>
            <Flex
                bg={"gray.100"}>
                <Stack mx={'auto'} spacing="2%" px={3} width="full">
                    <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
                    <Box align='center'>
                        <Select width="30%" size={"lg"} value={doctor} onChange={handleChange} bg="white">
                        {doctors.map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box>
                    <WorkingHourSettings />
                    <GeneralSettings />
                    <Holidays />
                    <TokenTypes />
                </Stack>
            </Flex>
        </>
    )
}
