
import {

    Box,
    Flex,
    Stack,

    Heading,

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
import 'react-phone-number-input/style.css'

export const PatientDetailsWithOtp = () => {
    let navigate = useNavigate()
    let location = useLocation()
    const [patients, setPatients] = useState([])
    const [token, setToken] = useState({
        id: "",
        phone: location.state.token.phone,
        new_name: "",
        name: "",
        fileNumber: ""
    })

    useEffect(() => {

      //  api.book.fetchPatients(`91${location.state.token.phone}`).then((res) => {
        api.book.fetchPatients(location.state.token.phone).then((res) => {
            const response = JSON.parse(res.data).result
            setPatients(response)
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

    function handleSubmit() {
        console.log(token)
        if (token.fileNumber != "" && (token.name != "" || token.new_name != "")) {
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

    return (
        <>
            <Flex
                minH={'100vh'}
                bg={"gray.100"}>
                <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
                <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                  
                            <Heading fontSize={'2xl'}>Book a Token</Heading>
                            <Box
                                rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                width="full"
                                p={8}>
                                <Stack spacing={4}>
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
                    
                    
                </Stack>
            </Flex>
        </>
    )
}
