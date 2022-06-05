import { Box, Flex, Heading, Stack, Image, Text, HStack, Center, VStack, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import api from "../api";


export const CurrentPatient = ({ current, setCurrent }) => {
    const [curr, setCurr] = useState("")

    useEffect(() => {
        console.log(current)
        const tokenNumber=current?.split("-")[1]
        const slot = current?.split("-")[0]
        api.token.fetchCurrent({ tokenNumber, slot}).then((res) => {
            const response = JSON.parse(res.data).result
            setCurr(response[0])
            console.log(response[0])
        })

    }, [current]);

    function next() {

        api.token.setAsCompleted({ item: curr }).then((res) => {
           
            const tokenNumber=current.split("-")[1]
            setCurrent(parseInt(tokenNumber) + 1)
            localStorage.setItem("current", `${curr.slot}-${parseInt(tokenNumber) + 1}`)
            //localStorage.setItem("slot", curr.slot)
            window.location.reload()
        })
    }

    return (
        <VStack>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '35rem' }}
                height={{ sm: '476px', md: '9rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={'white'}
                mx="auto"
                boxShadow={'2xl'}
                padding={4}>
                <HStack spacing={"auto"} width="full" height={"full"}>
                    <Box width="25%" height={"90%"}
                        rounded="lg"
                        boxShadow={"lg"}
                        textAlign="center"
                        paddingTop={"5%"}
                    >
                        <Heading color={"green"}>{`${curr?.slot}-${curr?.tokenNumber}`}</Heading>
                    </Box>
                    <VStack>
                        <Text fontWeight={"bold"} fontSize={"x-large"}>{curr?.name}</Text>
                        <Text fontWeight={"bold"} fontSize={"large"}>{curr?.type}</Text>
                    </VStack>
                    <VStack width="30%">
                        <Text fontWeight={"bold"} >Time in:</Text>
                        <Box width="full" height={"90%"}
                            rounded="lg"
                            boxShadow={"lg"}
                            textAlign="center"
                            padding={"2%"}
                        > <Text color={"green"} fontSize={"x-large"}>10.05 AM</Text>
                        </Box>
                    </VStack>
                </HStack>
            </Box>
            <Button marginTop={"2%"} size={"lg"} onClick={next} colorScheme={"green"}>NEXT</Button>
        </VStack>
    )
}