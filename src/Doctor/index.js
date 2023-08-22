import { Box, Circle, Heading, IconButton, Stack, HStack, Button, Flex, Input, Square, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaLaptop, FaMobileAlt } from "react-icons/fa"
import { TokenList } from "../Admin/TokenList"
import api from "../api"
import { AppContext } from "../App"
import { logout } from '../utils/tokenFunctions';
import { PhoneIcon } from "@chakra-ui/icons"

export const Doctor = () => {

    const { user, setUser } = useContext(AppContext)
    let doctor = user
    const [desktopView, setDesktopView] = useState(false)


    return (
        <Flex minH="100vh"
            bg="gray.100">

            <Stack m={3} spacing="0" width="full">

                <HStack justify="flex-start">
                    <Square size='20px' bg='green.200'></Square>
                    <Text fontSize="xs">Current</Text>
                    <Square size='20px' bg='gray.300'></Square>
                    <Text fontSize="xs">Completed</Text>
                    <Square size='20px' bg='yellow.100'></Square>
                    <Text fontSize="xs">Walk In</Text>
                    <Square size='20px' bg='red.300'></Square>
                    <Text fontSize="xs">Cancelled</Text>
                    <IconButton boxSize={10} bg="transparent" onClick={() => { setDesktopView(!desktopView) }}
                        display={{ base: 'flex', md: 'none' }}
                        icon={desktopView ? <FaMobileAlt /> : <FaLaptop />}></IconButton>
                </HStack>

                <TokenList desktopView={desktopView} doctor={doctor} />
            </Stack >
        </Flex >
    )
}