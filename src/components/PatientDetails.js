
import {
    Box,
    Flex,
    Stack,
    Heading,
    InputGroup,
    InputLeftAddon,
    Input,
    Button,
    FormControl,
    FormLabel,
    Select,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    useMediaQuery,
    EditablePreview,
    HStack,
    TableContainer,
    Divider,
    Thead,
    Tr,
    Th,
    VStack,
    Text,
    Table,
    Tbody,
    Td,
    useDisclosure,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaHome } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { filterDoctor, logout } from '../utils/tokenFunctions';
import { FullPageSpinner } from './Spinner';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { CloseIcon } from '@chakra-ui/icons';
import { CreatePatient } from './CreatePatient';

export const PatientDetails = (props) => {
    let navigate = useNavigate()
    let location = useLocation()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const { availability, navigateTo } = props
    const [patients, setPatients] = useState([])
    const [settings, setSettings] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [reasons, setReasons] = useState([])
    const { setDoctor, doctors, user, doctor, index, setIndex } = useContext(AppContext)
    let obj = {
        id: location.state && location.state.item ? location.state.item.patientID : "",
        phone: location.state && location.state.item ? `+${location.state.item.phone}` : "",
        new_name: "",
        name: location.state && location.state.item ? location.state.item.name : "",
        fileNumber: location.state && location.state.item ? location.state.item.fileNumber : "",
        doctor: doctor
    }
    const [token, setToken] = useState(location.state && location.state.tokenObj ? { ...obj, ...location.state.tokenObj }
        : obj)

    const [filter, setFilter] = useState([])
    const [searchFields, setSearchFields] = useState({  // search criteria
        fileNumber: "",
        name: "",
        phone: ""
    })
    const { isOpen, onOpen, onClose } = useDisclosure()


    useEffect(() => {

        //setDoctor(doctor.doctorID)
        //console.log(doctor.doctorID)
        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
            //   setMaxDate(new Date(today.setDate(today.getDate() + parseInt(response[0].review_date_limit))).toISOString().split('T')[0])
        })

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            console.log(response)
            setReasons(response)
        }).catch((err) => {
            console.log(err)
        })

        if (location.state && location.state.item) {

            api.book.fetchPatients(location.state.item.phone).then((res) => {
                const response = JSON.parse(res.data).result
                console.log(response)
                //response.push({})
                setPatients(response)
            })
        }

    }, [doctor])


    function handleNameChange(e) {
        if (e.target.value != "Add new") {
            setToken(prev => ({ ...prev, "fileNumber": patients[e.target.selectedIndex - 1].fileNumber }))
            setToken(prev => ({ ...prev, "id": patients[e.target.selectedIndex - 1].patientID }))
        }
        setToken(prev => ({ ...prev, "name": e.target.value }))
    }

    function handleNewNameChange(e) {
        setToken(prev => ({ ...prev, "new_name": e.target.value }))

    }

    function handleFileChange(e) {
        setToken(prev => ({ ...prev, "fileNumber": e.target.value }))

    }

    function handlePhoneChange(e) {

        setToken(prev => ({ ...prev, "phone": e }))

    }

    function handleDoctorChange(e) {
        console.log(e.target.value)
        setDoctor(e.target.value)
        localStorage.setItem("doctor", e.target.value)
        setToken(prev => ({ ...prev, "doctor": e.target.value }))
    }

    function handleNewChange(index) {
        let docArray = filterDoctor(doctors, user.userID)
        setDoctor(docArray[index].doctorID)
        setIndex(index)
        setToken(prev => ({ ...prev, "doctor": docArray[index].doctorID }))
        localStorage.setItem("doctor", docArray[index].doctorID)
        localStorage.setItem("tabIndex", index)
    }

    function fetchPatients() {

        //  api.book.fetchPatients(`91${token.phone}`).then((res) => {
        api.book.fetchPatients(token.phone).then((res) => {
            const response = JSON.parse(res.data).result
            response.push({ patientID: 0, name: "Add new" })
            setPatients(response)
        })
    }

    const searchPatientforAppt = (e) => {

        // on Enter or on pressing Search button
        if (e.key === "Enter" || e.target.id == "search") {
            // if there is atleast 1 search criteria
            if (Object.values(searchFields).length != 0) {
                setIsLoading(true)
                api.book.searchPatients(searchFields)
                    .then((res) => {
                        setIsLoading(false)
                        const response = JSON.parse(res.data)
                        setFilter("")
                        setFilter(response.result)
                    }).catch(err => {
                        setIsLoading(false)
                        alert(err)
                    })
            }
            else
                alert("Please enter a value in the search field")
        }
    }

    // set entered search criteria

    const handleChange = (e) => {

        setSearchFields(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const selectPatient = (patient) => {
        let copy = { ...token }

        copy.name = patient.name
        copy.phone = patient.phone
        copy.id = patient.patientID
        copy.fileNumber = patient.fileNumber

        setToken(copy)


    }

    function handleSubmit() {
        console.log(token)
        if (!isValidPhoneNumber(token.phone)) {
            alert("Please check the phone number you have entered!")
        }
        else {
            if ((token.name == "Add new" && token.new_name != "") || (token.name != "Add new" && token.name != "" && token.fileNumber != null && token.fileNumber != "")) {
                if (token.new_name == "") {
                    let file = patients.find((patient) => patient.patientID == token.id).fileNumber
                    if (token.fileNumber != file) {
                        setIsLoading(true)
                        api.token.editFileNumber({ token }).then((res) => {
                            setIsLoading(false)
                            navigate(navigateTo, { state: { token, settings, reasons } })
                        })
                    }
                    else {
                        navigate(navigateTo, { state: { token, settings, reasons } })
                    }
                }
                else {
                    setIsLoading(true)
                    api.book.createPatient({ token }).then((res) => {
                        setIsLoading(false)
                        const response = JSON.parse(res.data).result
                        setToken(prev => ({ ...prev, "id": response }))
                        console.log(response)
                        navigate(navigateTo, { state: { token, id: response, settings, reasons } })

                    })
                }
            }
            else {
                alert("Please fill in all the values")
            }
        }
    }


    function handleOldSubmit() {
        console.log(token)


        let file = filter.find((patient) => patient.patientID == token.id).fileNumber
        if (token.fileNumber != file) {
            setIsLoading(true)
            api.token.editFileNumber({ token }).then((res) => {
                setIsLoading(false)
                navigate(navigateTo, { state: { token, settings, reasons } })
            })
        }
        else {
            navigate(navigateTo, { state: { token, settings, reasons } })
        }





    }

    return (
        isLoading ? <FullPageSpinner /> :
            <Stack width={'full'}>
                <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                    <TabList m={1}>
                        {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                            : <Tab >{doctor.longInitials}</Tab>)}
                    </TabList>

                    <TabPanels>
                        {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                            <Box
                                rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                p={8}
                                width='full'>
                                {token.name != "" ?
                                    <Box bg="orange.50" rounded="lg" p={2}>
                                        <Text fontWeight={"semibold"}>You have selected : </Text>
                                        <HStack spacing="5" mt={5}>
                                            <FormControl>
                                                <FormLabel>File Number</FormLabel>
                                                <Input borderColor={"black"} type="text" onChange={handleFileChange}
                                                    value={token.fileNumber} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Patient Name</FormLabel>
                                                <Input borderColor={"black"} type="text" value={token.name} />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Patient Phone No.</FormLabel>
                                                <Input borderColor={"black"} type="text" value={token.phone} />
                                            </FormControl>
                                        </HStack>
                                        <Box align="right" >
                                            <Button onClick={() => setToken(prev => ({ ...prev, "name": "" }))}
                                                variant="outline" colorScheme={"red"}  >Clear Selection</Button>
                                            <Button m={3} onClick={handleOldSubmit} colorScheme="blue">Next</Button>
                                        </Box>
                                    </Box>
                                    :
                                    <Heading size={"md"} mt={5}>
                                        Choose Patient
                                    </Heading>}
                                <Divider m={3} orientation="horizontal" />
                                <TableContainer>
                                    <Table variant='striped' colorScheme='grey'>
                                        <Thead>
                                            <Tr>
                                                <Th>
                                                    <VStack align={"baseline"}>
                                                        <Text className='tableHeader' >File Number </Text>
                                                        <Input placeholder='Search by file number'
                                                            onKeyPress={searchPatientforAppt}
                                                            id="fileNumber" onChange={handleChange} value={searchFields.fileNumber}
                                                            type="text"
                                                            borderColor={"gray"}
                                                        ></Input>
                                                    </VStack>
                                                </Th>
                                                <Th> <VStack align={"baseline"}>
                                                    <Text className='tableHeader' >Name</Text>
                                                    <Input placeholder='Search by name'
                                                        onKeyPress={searchPatientforAppt}
                                                        id="name" onChange={handleChange} value={searchFields.name} borderColor={"gray"} type="text"></Input>
                                                </VStack>
                                                </Th>
                                                <Th> <VStack align={"baseline"}>
                                                    <Text className='tableHeader' >Phone Number</Text>
                                                    <Input placeholder='Search by phone'
                                                        onKeyPress={searchPatientforAppt}
                                                        id="phone" onChange={handleChange} value={searchFields.phone} borderColor={"gray"} type="text"
                                                    ></Input>
                                                </VStack>
                                                </Th>

                                                <Th width="5%"> <VStack align={"end"} >
                                                    <Text className='tableHeader'></Text>
                                                    <Button colorScheme={"blue"} id="search" onClick={searchPatientforAppt}>
                                                        Search
                                                    </Button>
                                                </VStack>
                                                </Th>
                                                <Th width="5%"> <VStack align={"end"} >
                                                    <Text className='tableHeader'></Text>
                                                    <Button onClick={onOpen} colorScheme={"blue"} id="create">
                                                        Create
                                                    </Button>
                                                </VStack>
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filter.map((patient) => <Tr style={{ cursor: "pointer" }} _hover={{ bg: "blue.50" }}
                                                onClick={() => selectPatient(patient)}
                                                value={patient.name} key={patient.patientID}>
                                                <Td width="17%">{patient.fileNumber}</Td>
                                                <Td>{patient.name}</Td>
                                                <Td>{patient.phone}</Td>
                                                <Td></Td>
                                                <Td></Td>
                                            </Tr>)}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                {filter.length == 0 ? <Box textAlign="center" py={10} px={6}>
                                    <CloseIcon boxSize={'20px'} color={'red'} />
                                    <Heading size="md" mt={6} mb={2}>
                                        No results
                                    </Heading>
                                </Box> : null}
                            </Box>
                        </TabPanel>)}
                    </TabPanels>
                </Tabs>
                <CreatePatient isOpen={isOpen} onClose={onClose} token={token}
                    setToken={setToken} settings={settings} reasons={reasons} 
                    navigateTo ={navigateTo}/>
            </Stack>
    )
}
