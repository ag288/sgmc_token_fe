import {
    Flex, Stack, Heading, Box, Divider, Grid, GridItem,
    HStack, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Button, IconButton, VStack, Image,
    Table, Thead, Tr, Th, Tbody, Td,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import '../components/icon.css'
import buzzer from '../Audio/buzzer.wav'
import api from "../api";
import { findPatientInitials } from "../utils/tokenFunctions";
import Simple from "../components/Navbar";
import { FaUser } from "react-icons/fa";
import { AppContext } from "../App";
import { useLocation, useNavigate } from 'react-router-dom'

export const TokenScreen = () => {

    const [current, setCurrent] = useState([])
    const [called, setCalled] = useState("")
    const [connected, setConnected] = useState(false)
    var myWebSocket = new WebSocket("ws://65.2.87.40:6447/");
    // var myWebSocket = new WebSocket("ws://localhost:6447/");
    const { user, setUser } = useContext(AppContext)
    const msg = new SpeechSynthesisUtterance()
    const navigate = useNavigate()

    myWebSocket.onclose = (event) => {
        setConnected(false)
        console.log("connection closed")
        window.location.reload()
        // myWebSocket = new WebSocket("ws://localhost:6447/")
    };


    //  if (!connected) {
    myWebSocket.onopen = (e) => {
        setConnected(true)
        console.log("Connection opened");
    };
    // }


    useEffect(() => {

        console.log("render")
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter' && user.userID == 5) {
                event.preventDefault();

                document.body.requestFullscreen()
            }
        };

        document.addEventListener('keydown', keyDownHandler);


        api.token.fetchTokenListForScreen().then((res) => {
            const response = JSON.parse(res.data).result
            // for (var i = 0; i < response.length; i++) {
            //     response[i].patientInitials = findPatientInitials(response[i])
            // }
            setCurrent(response)

        })

        // setInterval(() => {
        //     if (window.location.pathname == "/")
        //         window.location.reload()
        // }, 300000)

        myWebSocket.onmessage = function (evt) {

            console.log("message recieved")

            let data = JSON.parse(evt.data)
            if (data.tokenID) {
                console.log(data.tokenID)
                console.log(called)
                if (data.tokenID != localStorage.getItem("lastCalled")) {
                    let item = data.current.find(item => item.tokenID == data.tokenID)
                    // msg.text = item.slot.includes("W") ? item.oldTokenNumber ? `${item.initials}-${item.oldTokenNumber}` :
                    //     `${item.initials}W-${item.tokenNumber}` :
                    //     `${item.initials}-${item.tokenNumber}`
                    new Audio(buzzer).play()
                    // window.speechSynthesis.speak(msg)
                    //    for (var i = 0; i < data.current.length; i++) {
                    //   data.current[i].patientInitials = findPatientInitials(data.current[i])
                    //     }
                    setCurrent(data.current)
                    setCalled(data.tokenID)
                    localStorage.setItem("lastCalled", data.tokenID)
                }
            }
            else {
                setCurrent(data.current)
            }

        }
    }, [called])


    function logout() {

     //   navigate("/login")
        setUser(null)
        localStorage.removeItem("currentUser")
    }

    return (
        <>

            <Flex width="full" minH={"100vh"} bg="gray.100" >
                <Stack width='full' bg="white" p={3} m={2}>
                    <Box align="right">
                        <IconButton onClick={logout} icon={<FaUser />}></IconButton>
                    </Box>

                    {current.length > 0 ?

                        // <Grid spacing="1"
                        //     templateRows={`repeat(${current.length + 1}, 1fr)`}
                        //     templateColumns={`repeat(1, 1fr)`}>
                        //     <GridItem >
                        //         <HStack spacing="auto">
                        //             <Heading align="center" size="lg">{`Doctor`}</Heading>
                        //             <Heading align="center" color="red" size="lg">{`Room`}</Heading>
                        //             <Box align={"center"} >
                        //                 <Heading size="lg" >
                        //                     {"Token"}
                        //                 </Heading>
                        //             </Box>
                        //         </HStack>
                        //     </GridItem>
                        //     {current.map((item, index) =>
                        //         <GridItem className={called == item.tokenID ? "shortBlink" : ""} border={"2px"}>
                        //             <HStack spacing="auto">
                        //                 <Heading align="center" key={index}  size="2xl">{`${item.docName}`}</Heading>
                        //                 <Heading align="center" color="red" size="2xl">{`${item.room}`}</Heading>
                        //                 <Box align={"center"} p={5}>
                        //                     <Heading size={"4xl"} key={index}>
                        //                         {item.slot.includes("W") ?
                        //                             `${item.initials}W-${item.tokenNumber}` :
                        //                             `${item.initials}-${item.tokenNumber}`}
                        //                     </Heading>
                        //                 </Box>
                        //             </HStack>
                        //         </GridItem>
                        //     )} </Grid>


                        <Table size="lg" variant='unstyled'>
                            <Thead>
                                <Tr borderBottom="2px">
                                    <Th fontSize={"2xl"}>Doctor</Th>
                                    <Th fontSize={"2xl"}>Room</Th>
                                    <Th fontSize={"2xl"}>Token No</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {current.map((item, index) =>
                                    <Tr className={called == item.tokenID ? "shortBlink" : ""}
                                        borderBottom="2px"
                                        borderLeft="2px"
                                        borderRight="2px"
                                        key={index}>
                                        <Td fontWeight={"bold"} fontSize={"4xl"}>{item.docName}</Td>
                                        <Td fontWeight={"bold"} fontSize={"4xl"}>{item.room}</Td>
                                        <Td fontWeight={"bold"} fontSize={"4xl"} color="red">
                                            {item.slot.includes("W") ?
                                                `${item.initials}W-${item.tokenNumber}` :
                                                `${item.initials}-${item.tokenNumber}`}
                                        </Td>
                                    </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                        :
                        <VStack spacing={0}>
                            <Image
                                boxSize={"sm"}
                                src="https://static.qkdoc.com/clinic_logo/clinic_PTNNKB32498_09_02_2018_124953.png" />
                            <Heading>Welcome to Spring Garden Medical Specialists' and Family Clinic</Heading>
                        </VStack>}
                </Stack>
            </Flex>
        </>
    );
}


