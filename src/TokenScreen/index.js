import { Flex, Stack, Heading, Box, Divider, Grid, GridItem, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import '../components/icon.css'
import buzzer from '../Audio/buzzer.wav'
import api from "../api";

export const TokenScreen = () => {

    const [doctors, setDoctors] = useState([])
    const [current, setCurrent] = useState([])
    const [called, setCalled] = useState("")
    var myWebSocket = new WebSocket("ws://localhost:9090/");


    myWebSocket.onopen = () => {
        console.log("Connection opened");
        //  setConnectionOpen(true);
    };



    useEffect(() => {
        //playActive()

      api.token.fetchTokenListForScreen().then((res) => {
            const response = JSON.parse(res.data).result
            setCurrent(response)
            // setCurrent(response.filter(item => item.status == "current"))

        })
        //new Audio(beep).play()
        api.token.fetchDoctors().then((res) => {
            const response = JSON.parse(res.data).result
            setDoctors(response)
            // setCurrent(response.filter(item => item.status == "current"))

        })

        // buttonRef.current.click()
        myWebSocket.onmessage = function (evt) {
            new Audio(buzzer).play()
            let data = JSON.parse(evt.data)
            setCurrent(data.current)
            setCalled(data.tokenID)

            //   console.log(buttonRef)
            //    buttonRef.current.click()
            //   //speak({ text: evt.data })

            //   window.location.reload()
        };

    }, [called])


    return (
        <Flex width="full" minH={"100vh"} bg="gray.100" >
            <Stack width='full' bg="white" p={3} m={2}>
                <Grid spacing="auto" templateRows={`repeat(${Math.ceil(current.length/3)}, 1fr)`}
                    templateColumns={`repeat(${current.length<3 ? current.length : 3}, 1fr)`}>
                    {current.map((item,index) =>
                        <GridItem className={called == item.tokenID ? "shortBlink" : ""} border={"2px"}>
                            <Heading align="center" key={index} p={2} size="2xl">{`${item.docName}`}</Heading>
                            <Heading align="center" color="red" p={2} size="2xl">{`(${item.room})`}</Heading>
                                <Box align={"center"} p={5}>  <Heading size={"4xl"} key={index}>
                                    {item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}

                                </Heading>    </Box>
                            
                        </GridItem>
                    )} </Grid>
                {/* <Button  onClick={playActive} ref={buttonRef}>CLick</Button> */}
            </Stack>
        </Flex>
    );
}


