import {
    Box,
    Circle,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    VStack,
    Select,
    useMediaQuery,
    Text, Tabs, TabList, TabPanels, Tab, TabPanel, Button,
    Input
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { FaBell, FaEllipsisV, FaLaptop, FaMobile, FaMobileAlt, FaPhone, FaPhoneSquare } from 'react-icons/fa'
import { logout } from '../utils/tokenFunctions';
import { AppContext } from '../App';
import { TokenList } from "../PastAppointments/TokenList"

export const PastAppointments = () => {

    //let params= useParams()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [desktopView, setDesktopView] = useState(false)
    const { doctors, user } = useContext(AppContext)
    const [date, setDate] = useState()

    return (
        <>

            <Flex
                minH={'100vh'}
                //overflow={"scroll"}
                width="full"
                bg={"gray.100"}>
                <VStack width="full" m={3}>
                    <HStack width={isLaptop ? "50%" : "full"}>
                        <Text>Choose date</Text>
                        <Input width="50%" align="center" bg="white" type="date" value={date}
                            onChange={(e) => setDate(e.target.value)} />
                    </HStack>

                    <TokenList desktopView={desktopView} doctor={user} date={date} />

                </VStack>
            </Flex>
        </>
    )
}
