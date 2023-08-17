import { Box, Circle, Heading, IconButton, Stack, HStack, Button, Flex, Input } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaLaptop, FaMobileAlt } from "react-icons/fa"
import { TokenList } from "../Admin/TokenList"
import api from "../api"
import { AppContext } from "../App"
import { logout } from '../utils/tokenFunctions';

export const Doctor = () => {

    const { user, setUser } = useContext(AppContext)
    let doctor = user
    const [desktopView, setDesktopView] = useState(false)


    return (
        <Flex minH="100vh"
            bg="gray.100">

            <Stack m={3} spacing="0" width="full" alignItems="center">

                <HStack m={0} justify="flex-end">
                    <IconButton boxSize={10} bg="transparent" onClick={() => { setDesktopView(!desktopView) }}
                        display={{ base: 'flex', md: 'none' }}
                        icon={desktopView ? <FaMobileAlt /> : <FaLaptop />}></IconButton>
                </HStack>

                <TokenList desktopView={desktopView} doctor={doctor} />
            </Stack >
        </Flex >
    )
}