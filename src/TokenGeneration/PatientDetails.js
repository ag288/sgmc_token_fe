
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
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import api from '../api';

export const PatientDetails = () => {
    let navigate = useNavigate()
    let location = useLocation()
    const [patients, setPatients] = useState([])
    const [availability, setAvailability] = useState("")
    const [token, setToken] = useState({
        id: "",
        phone: "",
        new_name: "",
        name: "",
        fileNumber: ""
    })

    useEffect(() => {


        api.settings.checkAvailability().then((res) => {
            const response = JSON.parse(res.data).result
            setAvailability(response)
        })
    }, [])



    function handleNameChange(e) {
        console.log(e.target.selectedIndex)
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
        setToken(prev => ({ ...prev, "phone": e.target.value }))

    }

    function fetchPatients() {

        api.book.fetchPatients(`91${token.phone}`).then((res) => {
            const response = JSON.parse(res.data).result
            setPatients(response)
        })
    }

    function handleSubmit() {
        console.log(token)
        if (token.phone.length != 10) {
            alert("Phone number must be 10 digits!!")
        }
        else {
            if ((token.name == "Add new" && token.new_name != "") || (token.name != "Add new" && token.name != "" && token.fileNumber != "")) {
                if (token.new_name == "") {
                    navigate("/token-details", { state: { token } })
                }
                else {
                    api.book.createPatient({ token }).then((res) => {
                        const response = JSON.parse(res.data).result
                        console.log(response)
                        setToken(prev => ({ ...prev, "id": response }))
                        navigate("/token-details", { state: { token, id: response } })
                    })
                }
            }
            else {
                alert("Please fill in all the values")
            }
        }
    }

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
                <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                {availability != "" ?
                        <Heading size="md">{availability}</Heading>
                        :
                        <>
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
                                    <Input value={token.phone} onBlur={fetchPatients} onChange={handlePhoneChange} type="number" />
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
                                <Input type="text" value={token.fileNumber} onChange={handleFileChange} />
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
                    </>
}
                </Stack>
            </Flex>
        </>
    )
}
