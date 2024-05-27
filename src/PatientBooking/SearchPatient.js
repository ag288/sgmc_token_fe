
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
import { FaArrowRight, FaEllipsisV, FaFile, FaHome, FaIdCard, FaIdCardAlt, FaPhoneAlt, FaPlus, FaRegFileImage, FaRegIdBadge, FaRegistered, FaSearch, FaUber, FaUser } from 'react-icons/fa'
import { useContext, useEffect, useRef, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { filterDoctor, logout } from '../utils/tokenFunctions';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { CloseIcon, PlusSquareIcon, SearchIcon } from '@chakra-ui/icons';
import { FullPageSpinner } from '../components/Spinner';
import { CreatePatient } from './CreatePatient';

export const SearchPatient = ({ token, setToken, patientSelect, setPatientSelect }) => {
    let navigate = useNavigate()
    let location = useLocation()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [searched, setSearched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const [info, setInfo] = useState({
        new_name: "",
        phone: "",
        fileNumber: "",
        doctor: ""
    })


    const [filter, setFilter] = useState([])
    // const [searchFields, setSearchFields] = useState({
    //     fileNumber: "",
    //     name: "",
    //     phone: ""
    // })
    const { isOpen, onOpen, onClose } = useDisclosure()






    const searchPatientforAppt = (e) => {

        // on Enter or on pressing Search button

        // if there is atleast 1 search criteria
        if (token.phone != "") {
            console.log("api")
            setIsLoading(true)
            api.book.searchPatients(token)
                .then((res) => {
                    setIsLoading(false)
                    setSearched(true)
                    const response = JSON.parse(res.data)
                    setFilter("")
                    console.log(response.result)
                    setFilter(response.result)

                }).catch(err => {
                    setIsLoading(false)
                    alert(err)
                })
        }


    }

    // set entered search criteria

    const handleChange = (e) => {


        setToken(prev => ({ ...prev, phone: e.target.value }))




    }

    const selectPatient = (patient) => {

        setToken(prev => ({ ...prev, name: patient.name, phone: patient.phone, id: patient.patientID, fileNumber: patient.fileNumber }))
        setPatientSelect(true)

    }



    function createPatient() {
        // console.log(searchFields)
        setInfo(prev => ({
            ...prev,
            phone: `+91${token.phone}`
        }))
        onOpen()
    }
    return (

        <>


            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                width="full"
                p={4}>

                <FormControl>
                    <FormLabel>Enter phone number</FormLabel>
                    <HStack>
                        <Input placeholder='Search by phone'
                            id="phone" onChange={handleChange}
                            value={token.phone}
                            borderColor={"gray"} type="text" />
                        <Button colorScheme={"blue"} id="search" onClick={searchPatientforAppt}>
                            Search
                        </Button>
                    </HStack>

                </FormControl>
                <Divider m={3} orientation="horizontal" />
                {isLoading ? <FullPageSpinner /> : <VStack spacing={6} width="full" alignItems={"start"}>
                    {filter.map((patient, index) => <Text width="full" borderBottom={"1px"} style={{ cursor: "pointer" }}
                        _hover={{ bg: "blue.50" }}
                        bg={token.id == patient.patientID &&
                            token.phone == patient.phone ? "blue.50" : "white"}
                        onClick={() => selectPatient(patient)}
                        value={patient.name} key={index}>
                        {index + 1}. {patient.name}
                    </Text>)}
                </VStack>}
                {filter.length == 0 && searched && !isLoading ? <Box textAlign="center" py={10} px={6}>
                    <CloseIcon boxSize={'20px'} color={'red'} />
                    <Heading size="md" mt={6} mb={2}>
                        No results
                    </Heading>
                </Box> : null}
                {searched && <Box align="right" p={3}>

                    <Button leftIcon={<FaPlus />} onClick={createPatient} colorScheme={"blue"} id="create">
                        Create New
                    </Button>

                </Box>}
            </Box>




            <CreatePatient isOpen={isOpen} onClose={onClose} info={info}
                setInfo={setInfo} setPatientSelect={setPatientSelect} />
        </>
    )
}
