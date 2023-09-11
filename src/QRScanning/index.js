import { Flex, Heading, VStack, Stack, Box, Square, Center, Text, IconButton, Button }
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
            <VStack spacing={2} width="full">
            <Button onClick={() => logout(setUser)}></Button>
                <Heading size="lg">Spring Garden Family Clinic </Heading>
                <Text>Scan the Token QR Code from the link in your phone</Text>
                <Center w='95%' h={"80%"} m={5} bg='white'>

                    <VStack>
                        <QRScanner />
                    </VStack>

                </Center>
            </VStack>
        </Flex>
    )
}