
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
    Tooltip,
    Checkbox,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaFile, FaHome, FaIdCard, FaIdCardAlt, FaPhoneAlt, FaPlus, FaRegFileImage, FaRegIdBadge, FaRegistered, FaSearch, FaUber, FaUser } from 'react-icons/fa'
import { useContext, useEffect, useRef, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { filterDoctor, logout } from '../utils/tokenFunctions';
import { FullPageSpinner } from './Spinner';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { CloseIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
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
    const [info, setInfo] = useState({
        new_name: "",
        phone: "",
        fileNumber: ""
    })
    const { setDoctor, doctors, user, doctor, index, setIndex } = useContext(AppContext)
    let obj = {
        id: location.state && location.state.item ? location.state.item.patientID : "",
        phone: location.state && location.state.item ? location.state.item.phone : "",
        name: location.state && location.state.item ? location.state.item.name : "",
        fileNumber: location.state && location.state.item ? location.state.item.fileNumber : "",
        doctor: doctor
    }
    const [token, setToken] = useState(location.state && location.state.tokenObj ? { ...obj, ...location.state.tokenObj }
        : obj)

    const [filter, setFilter] = useState([])
    const [searchFields, setSearchFields] = useState({  // search criteria
        fileNumber: location.state && location.state.item ? location.state.item.fileNumber : "",
        name: location.state && location.state.item ? location.state.item.name : "",
        phone: location.state && location.state.item ? location.state.item.phone : ""
    })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [count, setCount] = useState(0)

    // previous booked patient
    let patient = localStorage.getItem("patient") ? JSON.parse(localStorage.getItem("patient")) : null

    useEffect(() => {
        console.log(searchFields)
        //setDoctor(doctor.doctorID)
        //console.log(doctor.doctorID)
        if (count == 1)
            searchPatientforAppt()
        else if (count > 1) {
            if (searchFields.fileNumber != "" || searchFields.phone != "" || searchFields.name != "") {

                setFilter(prev => prev.filter(item => item.name.toLowerCase().
                    includes(searchFields.name.toLowerCase()) && item.fileNumber.toLowerCase().
                        includes(searchFields.fileNumber.toLowerCase()) && item.phone.
                            includes(searchFields.phone)))
            }

            else
                setFilter([])
        }



    }, [doctor, searchFields])


    useEffect(() => {
        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
            //   setMaxDate(new Date(today.setDate(today.getDate() + parseInt(response[0].review_date_limit))).toISOString().split('T')[0])
        })

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        }).catch((err) => {
            console.log(err)
        })

    }, [])



    function handleFileChange(e) {
        setToken(prev => ({ ...prev, "fileNumber": e.target.value }))

    }



    function handleNewChange(index) {
        let docArray = filterDoctor(doctors, user.userID)
        setDoctor(docArray[index].doctorID)
        setIndex(index)
        setToken(prev => ({ ...prev, "doctor": docArray[index].doctorID }))
        localStorage.setItem("doctor", docArray[index].doctorID)
        localStorage.setItem("tabIndex", index)
    }


    const searchPatientforAppt = (e) => {

        // on Enter or on pressing Search button

        // if there is atleast 1 search criteria
        if (searchFields.fileNumber != "" || searchFields.phone != "" || searchFields.name != "") {
            setIsLoading(true)
            api.book.searchPatients(searchFields)
                .then((res) => {
                    setCount(prev => prev + 1)
                    setIsLoading(false)
                    const response = JSON.parse(res.data)
                    setFilter("")
                    setFilter(response.result)

                }).catch(err => {
                    setIsLoading(false)
                    alert(err)
                })
        }


    }

    // call search function on pressing enter

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            searchPatientforAppt()
        }

    }
    // set entered search criteria

    const handleChange = (e) => {


        setSearchFields(prev => ({ ...prev, [e.target.id]: e.target.value }))

        if (e.target.value.length == 4)
            setCount(1)
        if (e.target.value.length >= 4) {

            // if (count.current == 1)
            //     searchPatientforAppt()


        }
    }

    const selectPatient = (patient) => {
        let copy = { ...token }

        copy.name = patient.name
        copy.phone = patient.phone
        copy.id = patient.patientID
        copy.fileNumber = patient.fileNumber

        setToken(copy)
        window.scrollTo(0, 0);

    }


    function handleOldSubmit() {
        // to check if file number has been edited
        let file = filter.find((patient) => patient.patientID == token.id)?.fileNumber
        if (!file)
            file = patient.fileNumber
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

    function bookForPrevPatient(e) {
        if (e.target.checked) {
            if (patient) {
                setToken(prev => ({
                    ...prev, "name": patient.name ? patient.name : patient.new_name,
                    phone: patient.phone, fileNumber: patient.fileNumber
                }))

            }
        }
        
    }

    function createPatient() {
        console.log(searchFields)
        setInfo(prev => ({
            ...prev, "fileNumber": searchFields.fileNumber,
            "new_name": searchFields.name, phone: searchFields.phone
        }))
        onOpen()
    }
    return (

        <Stack width={'full'}>

            <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                <TabList m={1}>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab
                        key={doctor.doctorID}>{doctor.name}</Tab>
                        : <Tab >{doctor.longInitials}</Tab>)}
                </TabList>

                <TabPanels>
                    {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
                        {isLaptop && <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            p={8}
                            key={index}
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
                                : <HStack spacing="auto">
                                    <Heading size={"md"} mt={5}>
                                        Choose Patient
                                    </Heading>
                                    {patient && <Checkbox borderColor="gray" m={4}
                                        onChange={bookForPrevPatient}>
                                        Book token for previous patient
                                    </Checkbox>}
                                </HStack>}
                            <Divider m={3} orientation="horizontal" />
                            <TableContainer>
                                <Table variant='striped' colorScheme='grey'>
                                    <Thead>
                                        <Tr>
                                            <Th>
                                                <VStack align={"baseline"}>
                                                    <Text className='tableHeader' >File Number </Text>
                                                    <Input placeholder='Search by file number'
                                                        onKeyPress={handleKeyPress}
                                                        id="fileNumber" onChange={handleChange} value={searchFields.fileNumber}
                                                        type="text"
                                                        borderColor={"gray"}
                                                    ></Input>
                                                </VStack>
                                            </Th>
                                            <Th> <VStack align={"baseline"}>
                                                <Text className='tableHeader' >Name</Text>
                                                <Input placeholder='Search by name'
                                                    onKeyPress={handleKeyPress}
                                                    id="name" onChange={handleChange}
                                                    value={searchFields.name} borderColor={"gray"}
                                                    type="text"></Input>
                                            </VStack>
                                            </Th>
                                            <Th> <VStack align={"baseline"}>
                                                <Text className='tableHeader' >Phone Number</Text>
                                                <Input placeholder='Search by phone'
                                                    onKeyPress={handleKeyPress}
                                                    id="phone" onChange={handleChange}
                                                    value={searchFields.phone}
                                                    borderColor={"gray"} type="text"
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
                                                <Button onClick={createPatient} colorScheme={"blue"} id="create">
                                                    Create
                                                </Button>
                                            </VStack>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    {isLoading ? <FullPageSpinner /> : <Tbody>
                                        {filter.map((patient, index) => <Tr style={{ cursor: "pointer" }}
                                            _hover={{ bg: "blue.50" }}
                                            bg={token.id==patient.patientID &&
                                                token.phone==patient.phone ? "blue.50" : "white"}
                                            onClick={() => selectPatient(patient)}
                                            value={patient.name} key={index}>
                                            <Td width="17%">{patient.fileNumber}</Td>
                                            <Td>{patient.name}</Td>
                                            <Td>{patient.phone}</Td>
                                            <Td></Td>
                                            <Td></Td>
                                        </Tr>)}
                                    </Tbody>}
                                </Table>
                            </TableContainer>
                            {filter.length == 0 && !isLoading ? <Box textAlign="center" py={10} px={6}>
                                <CloseIcon boxSize={'20px'} color={'red'} />
                                <Heading size="md" mt={6} mb={2}>
                                    No results
                                </Heading>
                            </Box> : null}

                        </Box>}


                        {isMobile && <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            p={8}
                            key={index}
                            width='full'>{token.name != "" ?
                                <Box bg="orange.50" rounded="lg" p={2}>
                                    <Text fontWeight={"semibold"}>You have selected : </Text>
                                    <VStack spacing="5" mt={5}>
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
                                    </VStack>
                                    <Box>
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
                            <VStack align={"baseline"}>

                                <Input placeholder='Search by file number'
                                    onKeyPress={handleKeyPress}
                                    id="fileNumber" onChange={handleChange} value={searchFields.fileNumber}
                                    type="text"
                                    borderColor={"gray"}
                                ></Input>
                                <Input placeholder='Search by name'
                                    onKeyPress={handleKeyPress}
                                    id="name" onChange={handleChange}
                                    value={searchFields.name} borderColor={"gray"}
                                    type="text"></Input>
                                <Input placeholder='Search by phone'
                                    onKeyPress={handleKeyPress}
                                    id="phone" onChange={handleChange}
                                    value={searchFields.phone}
                                    borderColor={"gray"} type="text"
                                ></Input>
                                <HStack width="full" >
                                    <Tooltip label="search">
                                        <IconButton icon={<FaSearch />}
                                            rounded="full" id="search" onClick={searchPatientforAppt} />
                                    </Tooltip>
                                    <Tooltip label="create">
                                        <IconButton onClick={createPatient} icon={<FaPlus />}
                                            rounded="full" id="create" />
                                    </Tooltip>
                                </HStack>
                                {isLoading ? <FullPageSpinner /> :
                                    filter.map((patient, index) => <Box
                                        rounded="lg"
                                        width="full"
                                        p={3}
                                        m={2}
                                        boxShadow={"lg"}
                                        bg={token.id==patient.patientID &&
                                            token.phone==patient.phone ? "blue.50" : "white"}
                                        style={{ cursor: "pointer" }}
                                        _hover={{ bg: "blue.50" }}
                                        onClick={() => selectPatient(patient)}
                                        value={patient.name} key={index}>
                                        <HStack alignItems="start" spacing="5">
                                            <VStack spacing="5" alignItems={"start"}>
                                                <FaIdCardAlt />
                                                <FaUser />
                                                <FaPhoneAlt />
                                            </VStack>
                                            <VStack alignItems={"start"}>
                                                <Text>{patient.fileNumber}</Text>
                                                <Text>{patient.name}</Text>
                                                <Text>{patient.phone}</Text>
                                            </VStack>
                                        </HStack>
                                    </Box>)}

                                {filter.length == 0 && !isLoading ? <Box width="full"
                                    textAlign="center" py={"auto"} px={"auto"}>
                                    <CloseIcon boxSize={'20px'} color={'red'} />
                                    <Heading size="md" mt={6} mb={2}>
                                        No results
                                    </Heading>
                                </Box> : null}
                            </VStack>


                        </Box>}


                    </TabPanel>)}
                </TabPanels>
            </Tabs >
            <CreatePatient isOpen={isOpen} onClose={onClose} info={info}
                settings={settings} reasons={reasons}
                navigateTo={navigateTo} setInfo={setInfo} />
        </Stack >
    )
}
