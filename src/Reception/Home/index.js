import {
    Box,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Stack,
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../../api';
import { AfternoonListReception } from './AfternoonListReception';
import { CurrentPatientReception } from './CurrentPatientReception';
import { MorningListReception } from './MorningListReception';
import { FaEllipsisV } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

// List of staff profiles pending approval

export const PatientListReception = () => {

    const user = useContext(AppContext)
    const [current, setCurrent] = useState(0)
    const [mornlist, setMornList] = useState([])
    const [aftlist, setAftList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        api.token.fetchMorningList().then((res) => {
            const response = JSON.parse(res.data).result
            for (var i = 0; i < response.length; i++)
                if (response[i].status == "current") {
                    setCurrent(response[i])
                }
            setMornList(response)
        })

        api.token.fetchAfternoonList().then((res) => {
            const response = JSON.parse(res.data).result
            for (var i = 0; i < response.length; i++)
                if (response[i].status == "current") {
                    setCurrent(response[i])
                }
            setAftList(response)
        })

    }, []);

    function logout() {
        user.setUser(null)
        localStorage.removeItem("currentUser")
    }

    let navigate = useNavigate()


    return (
        <>

            <Flex
                minH={'100vh'}
                overflow={"scroll"}
                bg={"gray.100"}>

                {isLoading ? <Box width="full" alignItems={"center"} height="full"> <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size="xl"
                    ml={"40%"}
                    mt="20%"
                /> </Box> :
                    <Stack spacing="2%" mx="auto" py={12} px={6} width={'full'}>
                        <Box>
                            <Menu m="2%" closeOnBlur={true}>
                                <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                                <MenuList color={"black"}>
                                    <MenuItem onClick={() => navigate('/settings')} >Settings</MenuItem>
                                    <MenuItem onClick={() => navigate('/book')} >Book a token</MenuItem>
                                    <MenuItem onClick={() => navigate('/send-message')} >Send a message</MenuItem>
                                    <MenuItem onClick={logout} >Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Box>

                        <CurrentPatientReception current={current} setCurrent={setCurrent} />
                        <MorningListReception loading={isLoading} setIsLoading={setIsLoading} mornlist={mornlist} current={current} setCurrent={setCurrent} />
                        <AfternoonListReception loading={isLoading} setIsLoading={setIsLoading} aftlist={aftlist} current={current} setCurrent={setCurrent} />
                    </Stack>
                }

            </Flex>
        </>
    )
}
