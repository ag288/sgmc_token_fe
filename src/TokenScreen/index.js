import { Flex, Stack, Heading, Box, Divider, Grid, GridItem, HStack, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Button, IconButton } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import '../components/icon.css'
import buzzer from '../Audio/buzzer.wav'
import api from "../api";
import { findPatientInitials, logout } from "../utils/tokenFunctions";
import Simple from "../components/Navbar";
import { FaUser } from "react-icons/fa";
import { AppContext } from "../App";

export const TokenScreen = () => {

    const [current, setCurrent] = useState([])
    const [called, setCalled] = useState("")
    const [connected, setConnected] = useState(false)
    var myWebSocket = new WebSocket("ws://65.2.87.40:6447/");
    // var myWebSocket = new WebSocket("ws://localhost:6447/");
    const { user, setUser } = useContext(AppContext)
    const msg = new SpeechSynthesisUtterance()

    myWebSocket.onclose = (event) => {
        setConnected(false)
        console.log("connection closed")
        // myWebSocket = new WebSocket("ws://localhost:6447/")
    };


    if (!connected) {
        myWebSocket.onopen = (e) => {
            setConnected(true)
            console.log("Connection opened");
        };
    }


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
                    msg.text = item.slot.includes("W") ? item.oldTokenNumber ? `${item.initials}-${item.oldTokenNumber}` :
                        `${item.initials}W-${item.tokenNumber}` :
                        `${item.initials}-${item.tokenNumber}`
                    //  new Audio(buzzer).play()
                    window.speechSynthesis.speak(msg)
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


    return (
        <>

            <Flex width="full" minH={"100vh"} bg="gray.100" >
                <Stack width='full' bg="white" p={3} m={2}>
                    <Box align="right">
                        <IconButton onClick={() => logout(setUser)} icon={<FaUser />}></IconButton>
                    </Box>

                    {current.length > 0 ? <Grid spacing="auto" templateRows={`repeat(${Math.ceil(current.length / 3)}, 1fr)`}
                        templateColumns={`repeat(${current.length < 3 ? current.length : 3}, 1fr)`}>
                        {current.map((item, index) =>
                            <GridItem className={called == item.tokenID ? "shortBlink" : ""} border={"2px"}>
                                <Heading align="center" key={index} p={2} size="2xl">{`${item.docName}`}</Heading>
                                <Heading align="center" color="red" p={2} size="2xl">{`Room: ${item.room}`}</Heading>
                                <Box align={"center"} p={5}>
                                    <Heading size={"4xl"} key={index}>
                                        {item.slot.includes("W") ? item.oldTokenNumber ? `${item.initials}-${item.oldTokenNumber}` :
                                            `${item.initials}W-${item.tokenNumber}` :
                                            `${item.initials}-${item.tokenNumber}`}
                                    </Heading>
                                </Box>
                            </GridItem>
                        )} </Grid> : null}
                </Stack>
            </Flex>
        </>
    );
}


