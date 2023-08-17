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
import { TokenList } from "./TokenList"

export const PastAppointments = (props) => {

    //let params= useParams()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [desktopView, setDesktopView] = useState(false)
    const { doctors } = useContext(AppContext)
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
                    <Tabs display={"flex"} flexDirection={"column"} width="full" variant="solid-rounded"
                    isLazy>
                        <HStack> <TabList m={1}>
                            {doctors.map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                                : <Tab >{doctor.longInitials}</Tab>)}
                        </TabList>
                            <IconButton size="lg" bg="transparent" onClick={() => { setDesktopView(!desktopView) }}
                                display={{ base: 'flex', md: 'none' }} icon={desktopView ? <FaMobileAlt /> : <FaLaptop />}></IconButton>
                        </HStack>
                        <TabPanels>
                            {doctors.map((doctor, index) => <TabPanel width="full">
                                <TokenList desktopView={desktopView} doctor={doctor} date={date} />
                            </TabPanel>)}
                        </TabPanels>
                    </Tabs>

                </VStack>
            </Flex>
        </>
    )
}
