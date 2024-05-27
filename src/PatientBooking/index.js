
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
import { CreatePatient } from '../components/CreatePatient';
import { SearchPatient } from './SearchPatient';
import { BookToken } from './BookToken';

export const PatientBooking = () => {

    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [patientSelect, setPatientSelect] = useState(false)
    const [token, setToken] = useState({
        id: "",
        phone: "",
        name: "",
        fileNumber: "",
        doctor: "",
        slot: "",
        token: "",
        tokenNumber: "",
        reason: "",
        limit: 1,
        flag: 0
    })





    return (
        <Flex minH={'100vh'}
        bg={"gray.300"}>
        <Stack mx={'auto'} spacing="2%" py={2} px={2} width={'full'}>
            <Heading align="center" size="md">Spring Garden Health Care</Heading>
            {!patientSelect ? <SearchPatient token={token} setToken={setToken} patientSelect={patientSelect}
                setPatientSelect={setPatientSelect} /> : <BookToken token={token} setToken={setToken} patientSelect={patientSelect}
                setPatientSelect={setPatientSelect} />}
        </Stack >
        </Flex>
    )
}
