
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    HStack,
    Heading,
    Checkbox,
    VStack,
    Editable,
    EditablePreview,
    EditableInput,
    Text,
    Flex,
    Stack,
    IconButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    AccordionIcon,
    RadioGroup,
    Radio,
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { FaEllipsisV } from 'react-icons/fa';
import { logout } from '../../utils/tokenFunctions';
import { AppContext } from '../../App';
import { FullPageSpinner } from '../../utils/spinner';


// List of staff profiles pending approval

export const PhysioList = () => {

    const [slotlist, setSlotList] = useState([])
    const [free, setFree] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { user, setUser } = useContext(AppContext)

    useEffect(() => {


        setInterval(() => {
            if (window.location.pathname == "/" || window.location.pathname == "/home")
                window.location.reload()
        }, 180000)


        setIsLoading(true)
        api.physio.fetchSlotsforPhysio().then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            setSlotList(response)
        })

        api.token.fetchCurrent().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            if (response.length == 0)
                setFree(true)
        })

    }, []);


    function handleChange(e, tokenNumber, timeInEst, slotNumber) {
        let token = {
            slot: slotNumber,
            tokenNumber: tokenNumber,
            timeInEst: timeInEst,
            token: parseInt(e.target.value),
            reason: 1
        }
        navigate("/book", { state: { tokenObj: token } })
    }

    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            <Box>
                <Menu m="2%" closeOnBlur={true}>
                    <MenuButton as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                    <MenuList color={"black"}>
                        <MenuItem onClick={() => navigate('/book-review')} >Book future review</MenuItem>
                        <MenuItem onClick={() => logout(setUser)} >Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            {isLoading ? <FullPageSpinner /> :

                <Box m={6} width="full" rounded={"lg"} bg="white">

                    {free ? <Box rounded="lg" m={2} textAlign={"center"} bg="green.100"><Text p={2} fontSize={"lg"}>The Doctor is free!</Text></Box>
                        : null} <Heading size="lg" p={4}>Free Slots</Heading>
                    <Accordion p={5} allowToggle>
                        {slotlist.map((slot, index) => <AccordionItem key={index}>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        {`${new Date('1970-01-01T' + slot.start + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.end + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <RadioGroup>
                                    <VStack alignItems={"baseline"}>
                                        {slotlist[index].tokens.map((token) => <Radio key={token.tokenID} type={"number"} value={token.tokenID} onChange={(e) => handleChange(e, token.tokenNumber, token.timeInEst, slotlist[index].slotNumber)}>{`${token.tokenNumber}`}</Radio>)}
                                    </VStack>
                                </RadioGroup>
                            </AccordionPanel>

                        </AccordionItem>
                        )}

                    </Accordion>
                </Box>
            }

        </Flex>
    )
}

