import { Box, Spinner } from "@chakra-ui/react"

export const FullPageSpinner = () => {

    return (<Box width="full" alignItems={"center"} height="full"> <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size="xl"
        ml={"40%"}
        mt="20%"
    /> </Box>)
}