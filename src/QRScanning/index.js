import { Flex, Heading, Stack } from "@chakra-ui/react"
import { QRScanner } from "../components/QRScanner"

export const QRScanning = () => {
    return (
        <Flex bg="grey">
            <Stack mx="auto">
                <Heading>QR Code</Heading>
                <QRScanner />
            </Stack>
        </Flex>
    )
}