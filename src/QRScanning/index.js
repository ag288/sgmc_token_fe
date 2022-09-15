import { Flex, Heading, VStack, Stack, Box, Square, Center, Text } from "@chakra-ui/react"
import { QRScanner } from "./QRScanner"

export const QRScanning = () => {
    return (
        <Flex bg="gray.100"
            width="full"
            minH={"100vh"}
        >
            <VStack spacing={5} width="full">
                <Heading size="lg">Spring Garden Family Clinic</Heading>
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