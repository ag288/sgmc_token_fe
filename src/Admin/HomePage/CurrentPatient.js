import { HamburgerIcon, } from "@chakra-ui/icons";
import { Box, Heading, Text, HStack, VStack, Button, useDisclosure } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import api from "../../api";
import { ReviewModal } from "./ReviewModal";
import { onCompleted } from "../../utils/tokenFunctions";
import { AppContext } from "../../App";

export const CurrentPatient = ({ current, isLoading, setIsLoading, doctor }) => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [origin, setOrigin] = useState("")
    const [settings, setSettings] = useState([])
    const {user} = useContext(AppContext)
    const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure()

    useEffect(() => {

        api.settings.fetchSettings({doctor}).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })

    }, [current]);


    

    return (
        <VStack>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                width={isMobile ? "100%" : "50%"}
                height={{ sm: '476px', md: '9rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={'white'}
                mx="auto"
                boxShadow={'2xl'}
                padding={4}>{current ?
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
                            {current ? <Button colorScheme={"blue"} onClick={()=>onCompleted(current, settings, onOpenReview,doctor,setIsLoading, user.userID)}>Done</Button>
                                : null}
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

                    </HStack> :
                    <VStack>
                        <Heading color="green" width="full" textAlign={"center"} size="lg">
                            Please call the next token</Heading>
                        <Text>Click on  <HamburgerIcon boxSize={"5"} border={"1px"} />  next to the token and press <Button size="sm" colorScheme={"blue"}>Call</Button></Text>
                    </VStack>}

            </Box>
            <ReviewModal isOpen={isOpenReview} onClose={onCloseReview} doctor={doctor} current={current} isLoading={isLoading}
                setIsLoading={setIsLoading} />
        </VStack>
    )
}