import { Box, Flex, Heading, Stack, Image, Text, HStack, Center, VStack, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import api from "../api";


export const CurrentPatient = ({ current, setCurrent }) => {
    const [curr, setCurr] = useState("")

    useEffect(() => {
        console.log(current)
        api.token.fetchCurrent({ current }).then((res) => {
            const response = JSON.parse(res.data).result
            setCurr(response[0])
            console.log(response[0])
        })

    }, [current]);

    function next() {
        setCurrent(current + 1)
        localStorage.setItem("current", current + 1)
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
                        <Heading color={"green"}>{curr?.tokenNumber}</Heading>
                    </Box>
                    <VStack>
                        <Text fontWeight={"bold"} fontSize={"x-large"}>{curr?.name}</Text>
                        <Text fontWeight={"bold"} fontSize={"large"}>{curr?.reason}</Text>
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