import { ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    Flex,
    Stack,
    HStack,
    Tooltip,
    useDisclosure,
    IconButton,
    Text,
    Heading,
    Checkbox,
    filter,
    VStack,
    Input,
    Button,
    FormControl,
    FormLabel,
    List,
    useToast,
    ListItem,
    UnorderedList,
    useColorModeValue,
    RadioGroup,
    Radio,
    Select,
    InputGroup,
    InputLeftAddon
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FcHome } from 'react-icons/fc'
import { useEffect, useState } from 'react'
import api from '../api';

export const TokenGeneration = () => {
    let navigate = useNavigate()
    const [settings, setSettings] = useState("")
    const [patients, setPatients] = useState([])
    const [token, setToken] = useState({
        id: "",
        new_name: "",
        name: "",
        phone: "",
        fileNumber: ""
    })

    useEffect(() => {

        api.settings.checkAvailability().then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response)
        })

    }, [])

    function handleBlur(e) {
        console.log(e.target.value)
        api.book.fetchPatients(`91${e.target.value}`).then((res) => {
            const response = JSON.parse(res.data).result
            setPatients(response)
        })
    }

    function handleNameChange(e) {
        console.log(e.target.selectedIndex)
        if (e.target.value != "Add new") {
            setToken(prev => ({ ...prev, "fileNumber": patients[e.target.selectedIndex- 1].fileNumber }))
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
        setToken(prev => ({ ...prev, "phone": e.target.value }))

    }

    function handleSubmit() {
        console.log(token)
        if(token.fileNumber!="" && token.phone!=""){
        if (token.new_name == "") {
            navigate("/pagetwo", { state: { token } })
        }
        else {
            api.book.createPatient({ token }).then((res) => {
                const response = JSON.parse(res.data).result
                console.log(response)
                setToken(prev => ({ ...prev, "id": response }))
                navigate("/pagetwo", { state: { token, id: response } })
            })
        }
    }
    else {
        alert("Please fill in all the values")
    }
    }

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <Button m="1%" leftIcon={<FcHome />} colorScheme={"blue"} onClick={() => navigate('/home')}>Home</Button>

                {settings != "" ?
                    <Heading size="md">{settings}</Heading>
                    :
                    <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                        <Heading fontSize={'2xl'}>Book a Token</Heading>
                        <Box
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'lg'}
                            width="full"
                            p={8}>
                            <Stack spacing={4}>
                                <FormControl id="phone" isRequired >
                                    <FormLabel>Phone number</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children='91'></InputLeftAddon>
                                        <Input value={token.phone} onChange={handlePhoneChange} onBlur={handleBlur} type="number" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="name" isRequired >
                                    <FormLabel>Name</FormLabel>
                                    <Select placeholder={"Select name"} value={token.name} onChange={handleNameChange}>
                                        {patients.map((patient) => <option>{`${patient.name}`}</option>)}
                                        <option>Add new</option>
                                    </Select>
                                </FormControl>
                                {
                                    token.name == "Add new" ? <FormControl id="name" isRequired >
                                        <FormLabel>Enter the name</FormLabel>
                                        <Input value={token.new_name} onChange={handleNewNameChange}>
                                        </Input>
                                    </FormControl> : null}
                                <FormControl id="file">
                                    <FormLabel >File Number</FormLabel>
                                    <Input type="number" value={token.fileNumber} onChange={handleFileChange} />
                                </FormControl>

                            </Stack>
                            <Button
                                onClick={handleSubmit}
                                mt={4}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Next
                            </Button>
                        </Box>
                    </Stack>
                }
            </Flex>
        </>
    )
}
