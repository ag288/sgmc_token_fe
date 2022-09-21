
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
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaHome } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react'
import api from '../api';
import { AppContext } from '../App';
import { filterDoctor, logout } from '../utils/tokenFunctions';
import { FullPageSpinner } from './Spinner';

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
        phone: location.state && location.state.item ? location.state.item.phone.substring(2) : "",
        new_name: "",
        name: location.state && location.state.item ? location.state.item.name : "",
        fileNumber: location.state && location.state.item ? location.state.item.fileNumber : "",
        doctor: doctor
    }
    const [token, setToken] = useState(location.state && location.state.tokenObj ? { ...obj, ...location.state.tokenObj }
        : obj)

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
            setReasons(response)
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
        setToken(prev => ({ ...prev, "phone": e.target.value }))

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

        api.book.fetchPatients(`91${token.phone}`).then((res) => {
            const response = JSON.parse(res.data).result
            response.push({ patientID: 0, name: "Add new" })
            setPatients(response)
        })
    }

    // function filter(doctors){

    //     if(user.userID==3){
    //         return doctors.filter((doc)=>doc.department=="Orthopedics")
    //     }
    //     else return doctors
    // }

    function handleSubmit() {
        console.log(token)
        if (token.phone.length != 10) {
            alert("Phone number must be 10 digits!!")
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
                        // const message = JSON.parse(res.data).message
                        // console.log(message)
                        // if (responsemessage == "") {
                        setToken(prev => ({ ...prev, "id": response }))
                        console.log(response)
                        navigate(navigateTo, { state: { token, id: response, settings, reasons } })
                        // }
                        // else {
                        //     let msg = `${message}\nThe following patients were found with this file number:\n`
                        //     for (var i = 0; i < response.length; i++) {
                        //         msg += `${i + 1}. ${response[i].name}\n}`
                        //     }
                        //     msg += "\n Do you want to merge the following patients?"
                        //     const merge = window.confirm(msg)
                        // }
                    })
                }
            }
            else {
                alert("Please fill in all the values")
            }
        }
    }

    return (
        isLoading ? <FullPageSpinner /> :
            <Stack mx={'auto'} width="auto" spacing="2%" py={12} px={6} >
                <Tabs m={2} defaultIndex={index} onChange={handleNewChange} variant="solid-rounded">
                    <TabList m={1}>
                        {filterDoctor(doctors, user.userID).map((doctor, index) => isLaptop ? <Tab >{doctor.name}</Tab>
                            : <Tab >{doctor.longInitials}</Tab>)}
                    </TabList>

                    <TabPanels>
                        {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>



                            {/* <Box align='center'>
                        <Select size={"lg"} value={doctor} onChange={handleDoctorChange} bg="white">
                        {filterDoctor(doctors, user.userID).map((doctor)=> <option value={doctor.doctorID} >{doctor.name}</option>)}
                        </Select></Box> */}
                            {availability != "" ?
                                <Heading size="md">{availability}</Heading>
                                :
                                <>

                                    <Heading color="red" fontSize={'2xl'}>Book a Token</Heading>

                                    <Box
                                        rounded={'lg'}
                                        bg={'white'}
                                        boxShadow={'lg'}
                                        width="full"
                                        p={8}>
                                        <Stack spacing={4}>
                                            {location.state && location.state.tokenObj ? <Heading size="sm">{`Selected Token Number: ${token.tokenNumber}; ETA: ${token.timeInEst}`}</Heading> : null}
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
                                                    {patients.map((patient) => <option key={patient.patientID}>{`${patient.name}`}</option>)}
                                                    { /* {patients.length==0 ? null : <option>Add new</option>}*/}
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
                        </TabPanel>)}
                    </TabPanels>
                </Tabs>
            </Stack>
    )
}
