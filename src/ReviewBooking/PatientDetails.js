
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
    Spinner,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaHome, FaList } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { logout } from '../utils/tokenFunctions';

export const PatientDetailsforReview = () => {
    let navigate = useNavigate()
    let location = useLocation()
    const { user, setUser } = useContext(AppContext)
    const [patients, setPatients] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState({
        id: location.state ? location.state.item.patientID : "",
        phone: location.state ? location.state.item.phone.substring(2) : "",
        new_name: "",
        name: location.state ? location.state.item.name : "",
        fileNumber: location.state ? location.state.item.fileNumber : "",
        reviewID: ''
    })

    useEffect(() => {

        if (location.state && location.state.item.phone) {
            setIsLoading(true)
            api.book.fetchPatients(location.state.item.phone).then((res) => {
                setIsLoading(false)
                const response = JSON.parse(res.data).result
                setPatients(response)
            })
        }

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
                    api.review.reviewExists({ id: token.id }).then((res) => {
                        const response = JSON.parse(res.data).result
                        console.log(response)
                        if (response.length == 0)
                            navigate("/review-details", { state: { token } })
                        else {
                            let update = window.confirm(`A review already exists for ${token.name} on ${new Date(response[0].date).toDateString()}. Proceed to update existing review?`)
                            if (update) {
                               // setToken(prev => ({ ...prev, "reviewID": response.reviewID }))
                                navigate("/review-details", { state: { token, reviewID:response[0].reviewID } })
                            }
                            else {
                                navigate("/home")
                            }
                        }
                    })
                }
                else {
                    api.book.createPatient({ token }).then((res) => {
                        const response = JSON.parse(res.data).result
                        console.log(response)
                        setToken(prev => ({ ...prev, "id": response }))
                        navigate("/review-details", { state: { token, id: response } })
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
                {/* Logout button for physio */}
                {user.userID == 3 ?
                    <Box>
                        <Menu m="2%" closeOnBlur={true}>
                            <MenuButton isDisabled={isLoading} as={IconButton} icon={<FaEllipsisV />} backgroundColor="transparent" />
                            <MenuList color={"black"}>
                                <MenuItem onClick={() => navigate('/book-review')} >Book a future review</MenuItem>
                                <MenuItem onClick={() => navigate('/book')} >Book a token</MenuItem>
                                <MenuItem onClick={() => logout(setUser)} >Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                    :
                    <HStack alignItems={"baseline"} spacing="auto">
                         <IconButton isDisabled={isLoading} size="lg" bg='transparent' width="fit-content" icon={<FaList />} onClick={() => navigate('/home')}></IconButton>
                        <IconButton isDisabled={isLoading} size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
                         </HStack>
                      }
                {isLoading ? <Box width="full" alignItems={"center"} height="full"> <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size="xl"
                    ml={"40%"}
                    mt="20%"
                /> </Box> :
                    <Stack mx={'auto'} spacing="2%" py={12} px={6} width={'auto'}>
                        <Heading color={"crimson"} fontSize={'2xl'}>Book a Future Review</Heading>
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
                    </Stack>}
            </Flex>
        </>
    )
}
