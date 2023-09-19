import { Flex, Heading, VStack, Stack, Box, Square, Center, Text, IconButton, Button, HStack }
    from "@chakra-ui/react"
import { QRScanner } from "./QRScanner"
import { logout } from '../utils/tokenFunctions';
import { AppContext } from '../App';
import { useContext } from "react"

export const QRScanning = () => {
    const { setUser } = useContext(AppContext)
    return (
        <Flex bg="gray.100"
            width="full"
            minH={"100vh"}
        >
            <VStack spacing={2} width="full" p={0}>

                <HStack>
                    <Heading size="lg">Spring Garden Family Clinic </Heading>
                    <Button onClick={() => logout(setUser)}></Button>
                </HStack>
                <Text>Scan the Token QR Code from the link in your phone</Text>
                <Center w='95%' h={"80%"} m={1} bg='white'>
                    <VStack>
                        <QRScanner />
                    </VStack>

                </Center>
            </VStack>
        </Flex>
    )
}