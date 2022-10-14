import { Flex, Stack, Heading, Box, Divider, Grid, GridItem, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import '../components/icon.css'
import buzzer from '../Audio/buzzer.wav'
import api from "../api";
import { findPatientInitials } from "../utils/tokenFunctions";

export const TokenScreen = () => {

    const [doctors, setDoctors] = useState([])
    const [current, setCurrent] = useState([])
    const [called, setCalled] = useState("")
    var myWebSocket = new WebSocket("ws://65.2.87.40:6447/");


    myWebSocket.onopen = () => {
        console.log("Connection opened");
    };



    useEffect(() => {

        api.token.fetchTokenListForScreen().then((res) => {
            const response = JSON.parse(res.data).result
            for (var i = 0; i < response.length; i++) {
                response[i].patientInitials = findPatientInitials(response[i])
            }
            setCurrent(response)

        })
        api.token.fetchDoctors().then((res) => {
            const response = JSON.parse(res.data).result
            setDoctors(response)
        })

        myWebSocket.onmessage = function (evt) {
            new Audio(buzzer).play()
            let data = JSON.parse(evt.data)
            for (var i = 0; i < data.current.length; i++) {
                data.current[i].patientInitials = findPatientInitials(data.current[i])
            }
            setCurrent(data.current)
            setCalled(data.tokenID)
        };

    }, [called])

    return (
        <Flex width="full" minH={"100vh"} bg="gray.100" >
            <Stack width='full' bg="white" p={3} m={2}>
                <Grid spacing="auto" templateRows={`repeat(${Math.ceil(current.length / 3)}, 1fr)`}
                    templateColumns={`repeat(${current.length < 3 ? current.length : 3}, 1fr)`}>
                    {current.map((item, index) =>
                        <GridItem className={called == item.tokenID ? "shortBlink" : ""} border={"2px"}>
                            <Heading align="center" key={index} p={2} size="2xl">{`${item.docName}`}</Heading>
                            <Heading align="center" color="red" p={2} size="2xl">{`(${item.room})`}</Heading>
                            <Box align={"center"} p={5}>
                                <Heading size={"4xl"} key={index}>
                                    {item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber} (${item.patientInitials})` : `${item.initials}-${item.tokenNumber} (${item.patientInitials})`}
                                </Heading>
                            </Box>
                        </GridItem>
                    )} </Grid>
            </Stack>
        </Flex>
    );
}


