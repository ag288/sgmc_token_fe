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
    Stack,
    Select,
    useMediaQuery,
    Text, Tabs, TabList, TabPanels, Tab, TabPanel, Button
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { FaBell, FaEllipsisV, FaLaptop, FaMobile, FaMobileAlt, FaPhone, FaPhoneSquare } from 'react-icons/fa'
import { logout } from '../utils/tokenFunctions';
import { AppContext } from '../App';
import { TokenList } from './TokenList';

export const AdminPatientList = (props) => {

    const { setUser, setDoctor, doctor, doctors, index, setIndex } = useContext(AppContext)
    //let params= useParams()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [desktopView, setDesktopView] = useState(false)

    useEffect(() => {

        setInterval(() => {
            if (window.location.pathname == "/" || window.location.pathname == "/home")
                window.location.reload()
        }, 300000)




    }, [doctor]);






    function handleNewChange(index) {

        setDoctor(doctors[index].doctorID)
        setIndex(index)
        localStorage.setItem("doctor", doctors[index].doctorID)
        localStorage.setItem("tabIndex", index)
    }

    return (
        <>

            <Flex
                minH={'100vh'}
                //overflow={"scroll"}
                width="full"
                bg={"gray.100"}>
                <Box width="full">
                    <Box m={2} align="right">
                        <Button onClick={()=>logout(setUser)} colorScheme={"blue"} align="right">Logout</Button>
                    </Box>
                    <Tabs display={"flex"} flexDirection={"column"} width="full" defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                        <HStack> <TabList m={1}>
                            {doctors.map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                                : <Tab >{doctor.longInitials}</Tab>)}
                        </TabList>
                            <IconButton size="lg" bg="transparent" onClick={() => { setDesktopView(!desktopView) }}
                                display={{ base: 'flex', md: 'none' }} icon={desktopView ? <FaMobileAlt /> : <FaLaptop />}></IconButton>
                        </HStack>
                        <TabPanels>
                            {doctors.map((doctor, index) => <TabPanel width="full">
                                <TokenList desktopView={desktopView} doctor={doctor} />
                            </TabPanel>)}
                        </TabPanels>
                    </Tabs>

                </Box>
            </Flex>
        </>
    )
}
