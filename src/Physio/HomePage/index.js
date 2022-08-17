
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
    Select,
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
    Button,
    Grid,
    GridItem,
    useMediaQuery,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { FaEllipsisV } from 'react-icons/fa';
import { filterDoctor, logout } from '../../utils/tokenFunctions';
import { AppContext } from '../../App';
import { FullPageSpinner } from '../../utils/spinner';

// List of staff profiles pending approval

export const PhysioList = () => {

    const [slotlist, setSlotList] = useState([])
    const [free, setFree] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [availability, setAvailability] = useState("")
    const navigate = useNavigate()
    const { user, setUser, doctor, doctors, setDoctor, index, setIndex } = useContext(AppContext)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
   // console.log(filterDoctor(doctors,3))
    useEffect(() => {


        setInterval(() => {
            if (window.location.pathname == "/" || window.location.pathname == "/home")
                window.location.reload()
        }, 180000)

console.log(doctor)
        setIsLoading(true)
        api.physio.fetchSlotsforPhysio({doctor}).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data)
            if (!(response.message))
                setSlotList(response.result)
        })

        api.token.fetchCurrent({doctor}).then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            if (response.length == 0)
                setFree(true)
        })

        api.settings.checkAvailability({doctor}).then((res) => {
            const response = JSON.parse(res.data).result
            setAvailability(response)
        })

    }, [doctor]);



    function handleChange(e, tokenNumber, timeInEst, slotNumber) {
        console.log("hi")
        let token = {
            slot: slotNumber,
            tokenNumber: tokenNumber,
            timeInEst: timeInEst,
            token: parseInt(e.target.id),
            reason: 1
        }
        navigate("/book", { state: { tokenObj: token } })
    }

    function handleDoctorChange(e){
setDoctor(e.target.value)
localStorage.setItem("doctor", e.target.value)
    }

    function handleNewChange(index) {
        let docArray=filterDoctor(doctors,user.userID)
        setDoctor(docArray[index].doctorID)
        setIndex(index)
        localStorage.setItem("doctor",docArray[index].doctorID)
        localStorage.setItem("tabIndex",index)
      }

    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            {/* <Box>
                <Menu m="2%" closeOnBlur={true}>
                    <MenuButton as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                    <MenuList color={"black"}>
                        <MenuItem onClick={() => navigate('/book-review')} >Book future review</MenuItem>
                        <MenuItem onClick={() => logout(setUser)} >Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Box> */}
            {isLoading ? <FullPageSpinner /> :

                <Box m={6} width="full" rounded={"lg"} bg="white">
                    {/* <Box m={3} align='center'>
                        <Select width="30%" size={"lg"} value={doctor} onChange={handleDoctorChange} bg="white">
                            {filterDoctor(doctors).map((doctor) => <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box> */}
                         <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                        <TabList>
                            {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
                        </TabList>

                        <TabPanels>
                            {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                         
                    <>
                    {free && availability =="" ? <Box rounded="lg" m={2} textAlign={"center"} bg="green.100"><Text p={2} fontSize={"lg"}>The Doctor is free!</Text></Box>
                        : <Box rounded="lg" m={2} textAlign={"center"} bg="red.300"><Text p={2} fontSize={"lg"}>The Doctor is not available!</Text></Box>}
                   { availability == "" ? <Box p={5} >
                       {slotlist.map((slot, index) => <Box align={"center"} key={index}>

                            <Box my={5} fontWeight={"bold"}>
                                {`${new Date('1970-01-01T' + slot.start + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })} - ${new Date('1970-01-01T' + slot.end + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`}
                            </Box>
                            {isMobile && <Grid templateRows={'repeat(2, 1fr)'} gap={2} width={"fit-content"} templateColumns={'repeat(3, 1fr)'}>

                                {slotlist[index].tokens.map((token) => <GridItem><Button key={token.tokenID} id={token.tokenID} onClick={(e) => handleChange(e, token.tokenNumber, token.timeInEst, slotlist[index].slotNumber)}>{`${token.tokenNumber}`}</Button></GridItem>)}

                            </Grid>}

                            {isLaptop && <VStack> <HStack alignItems="center">
                                {slotlist[index].tokens.map((token) => <Button key={token.tokenID} id={token.tokenID} onClick={(e) => handleChange(e, token.tokenNumber, token.timeInEst, slotlist[index].slotNumber)}>{`${token.tokenNumber}`}</Button>)}
                            </HStack> </VStack>
                            }
                        </Box>)} 

                    </Box> : null}
                    </>      
                            </TabPanel>)}
                        </TabPanels>
                    </Tabs>
                </Box>
                        }

        </Flex>
    )
}

