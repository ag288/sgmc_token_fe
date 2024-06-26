import { ReactNode, useContext, useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
    useToast
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { BellWithBadge, DuplicatePatientsNotif , ArrivalNotif} from './AlertIcons';
import { AppContext } from '../App';
import { useLocation, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { ExportToExcel } from '../Reception/HomePage/ExportToExcel';
import api from '../api';
import { ListPrintIcon } from '../Reception/HomePage/ListPrintIcon';
import { FaPrint } from 'react-icons/fa';
import {ArrivalModal} from '../Reception/HomePage/ArrivalModal'



const ActiveRoute = (routeName) => {
    let location = useLocation()
    if (location && location.pathname === routeName)
        return 'active'
    else if (location && location.pathname == "/review-details" && routeName == "/book-review")
        return "active"
    else if (location && location.pathname == "/token-details" && routeName == "/book")
        return "active"
    else
        return "";
};

const NavLinks = ({ link }) => (
    <NavLink to={link.path} key={link.name}>
        {ActiveRoute(link.path) == "active" ? <Button
            px={2}
            py={1}
            bg={"black"}
            rounded={'md'}
            color="white"
            _hover={{
                textDecoration: 'none',
                bg: 'black',
            }}
        > {link.name}</Button> : <Button px={2}
            py={1}
            bg={"transparent"}
            rounded={'md'}
            color="white"
            _hover={{
                textDecoration: 'none',
                bg: 'black',
            }}
        > {link.name}</Button>
        }
    </NavLink>
);

export default function Simple() {

    const [pendingCount, setPendingCount] = useState()
    const [duplicateCount, setDuplicateCount] = useState()
    const toast = useToast()

    useEffect(() => {
        if (!pendingCount && !duplicateCount) {
            api.token.fetchAlerts().then((res) => {
                const result = JSON.parse(res.data).result
                // if (result[0].length > 0) {
                //     toast({
                //         title: 'Tokens not generated!!',
                //         description: "Some reviews have not been generated. Click on the bell icon for details",
                //         status: 'error',
                //         duration: 5000,
                //         position: "top",
                //         isClosable: true


                //     })
                // }
                setPendingCount(result[0].length)
                setDuplicateCount(result[1].length)

            })
        }
    }, [])


    function logout() {
   
      //  navigate("/login")
        setUser(null)
        localStorage.removeItem("currentUser")
    }

    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setUser, doctor } = useContext(AppContext)
    let navigate = useNavigate()

    function defineLinks() {
        let links
        if (user.userID == 1) {
            links = [{ name: 'Home', path: "/home" },
            { name: 'Daily Token', path: "/book" },
            { name: 'Settings', path: "/settings" },
            { name: 'Past Appointments', path: "/history" }]
        }
        else if (user.userID == 2) {
            links = [{ name: 'Home', path: "/home" },
            { name: 'Daily Token', path: "/book" },
            { name: 'Future Token', path: "/book-review" },
            { name: 'Settings', path: "/settings" },
            { name: 'Past Appointments', path: "/history" }]
        }
        else if (user.userID == 3) {
            links = [{ name: 'Home', path: "/home" },
            { name: 'Future Token', path: "/book-review" },
            { name: 'Past Appointments', path: "/history" }]
        }

        else if (user.userID == 6) {
            links = [{ name: 'Home', path: "/home" },
            { name: 'Past Appointments', path: "/history" },
            { name: 'Future Appointments', path: "/review-list" }]
        }
        else if (user.doctorID) {
            links = [{ name: 'Home', path: "/home" },
            { name: 'Future Appointments', path: "/future" },
            { name: 'Past Appointments', path: "/history" }]
        }
        else
            links = [{ name: 'Home', path: "/home" }]
        return links
    }
    const Links = defineLinks()



    function viewPendingReviews() {
        navigate("/pending-reviews")
    }

    function viewDuplicatePatients() {
        navigate("/duplicates")
    }


    return (
        <>
            <Box bg={useColorModeValue('teal.400', 'white')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        {/* <Box>
                            <Image
                            
                             boxSize={"28"} src={'https://static.qkdoc.com/clinic_logo/clinic_PTNNKB32498_09_02_2018_124953.png'}>
                                </Image></Box> */}

                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLinks link={link}>{link.name}</NavLinks>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        {user.userID == 2 && <Menu>
                            <MenuButton
                                as={IconButton}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                                mx={2}
                                color={"white"}
                                icon={<FaPrint />}>

                            </MenuButton>
                            <MenuList>
                                <ListPrintIcon timeOfDay={"Morning"} />
                                <ListPrintIcon timeOfDay={"Afternoon"} />
                            </MenuList>
                        </Menu>}
                       {user.userID == 2 && <BellWithBadge onClick={viewPendingReviews} count={pendingCount} />}
                        {user.userID == 2 && <DuplicatePatientsNotif onClick={viewDuplicatePatients} count={duplicateCount} />}

                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={"md"}
                                    name={user.username}
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={logout} >Logout</MenuItem>
                                {user.userID == 2 && <ExportToExcel doctor={doctor} />}
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link, index) => (
                                <NavLinks key={index} link={link}>{link.name}</NavLinks>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
          
            {/* <DoctorTabs/> */}
        </>
    );
}