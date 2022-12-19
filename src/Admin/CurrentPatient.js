import { HamburgerIcon, } from "@chakra-ui/icons";
import { Box, Heading, Text, HStack, VStack, Button, useDisclosure } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { AppContext } from "../App";

export const CurrentPatient = ({ current}) => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])

   
    useEffect(() => {

   
    }, [current]);




    return (
        <VStack>
            {current ? <Box
                borderWidth="1px"
                borderRadius="lg"
                width={isMobile ? "100%" : "50%"}
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
                        <Heading color={"green"}>{current.slot.includes("W") ? `${current?.initials}W-${current?.tokenNumber}` : `${current?.initials}-${current?.tokenNumber}`}</Heading>
                    </Box>
                    <VStack>
                        <Text noOfLines={1} fontWeight={"bold"} fontSize={"large"}>{current?.name}</Text>
                        <Text fontWeight={"bold"} fontSize={"large"}>{current?.type}</Text>

                    </VStack>
                    <VStack width="30%">
                        <Text fontWeight={"bold"} >Time in:</Text>
                        <Box width="full" height={"90%"}
                            rounded="lg"
                            boxShadow={"lg"}
                            textAlign="center"
                            padding={"2%"}
                        > <Text color={"green"} fontSize={"x-large"}>{current.timeIn ? new Date('1970-01-01T' + current.timeIn + 'Z')
                            .toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                            </Text>
                        </Box>

                    </VStack>

                </HStack>

            </Box> :
                null}
        </VStack>
    )
}