
import { CheckIcon } from '@chakra-ui/icons'
import {
    Box,
    HStack,
    Text,
    Heading,
    VStack,
    Input,
    Button,
    useToast,
    Divider,
    IconButton,
    InputGroup,
    InputRightAddon,
    Editable,
    EditablePreview,
    EditableInput
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../api'



export const TokenTypes = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [reasons, setReasons] = useState([])
    const toast = useToast()

    useEffect(() => {

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        })
    }, []);


    function handleChange(e, reason) {

        let index = reasons.indexOf(reasons.find(item => item.reasonID == reason.reasonID))
        console.log(index)
        let copy = [...reasons]
        copy[index].duration = e
        setReasons(copy)
    }

    function updateReasons(reason) {
        api.settings.updateReasons({ reason }).then((res) => {
           //do nothing
        }).catch((err) => {
            toast({
                title: 'An error occured.',
                description: 'Please try again later',
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        })
    }



    return (
        <>

            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}
                width='full'>
                <Heading size="lg">Token Types</Heading>
                <VStack width="full">
                    {reasons.map((reason) => <VStack width="full" alignItems={"baseline"} p={4}>
                        <Text fontWeight={"bold"}>{reason.name}</Text>
                        <HStack>
                        <Editable onSubmit={() => updateReasons(reason)}  onChange={(e) => handleChange(e, reason)} value={reason.duration}>
                            <EditablePreview />
                            <EditableInput />
                        </Editable>
                        <Text color="grey">minutes</Text>
                          </HStack>
                    </VStack>)}
                </VStack>
            
            </Box>

        </>
    )
}
