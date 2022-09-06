import { Flex, Heading, Stack } from "@chakra-ui/react"
import { QRScanner } from "../components/QRScanner"

export const QRScanning = () => {
    return (
        <Flex bg="gray.100"
        width="full"
        minH={'100vh'}>
            <Stack mx="auto" my="auto">
                <QRScanner />
            </Stack>
        </Flex>
    )
}