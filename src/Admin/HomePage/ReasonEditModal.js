import {
    Button, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    HStack,
    IconButton,
    useToast,
    Td,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    RadioGroup,
    VStack,
    Radio,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import api from '../../api';
import { AppContext } from '../../App';
//ask for file number and no of days after which review is required



export const ReasonEditModal = (props) => {

    const { item, isOpen, onClose } = props
    const [newReason, setNewReason] = useState()
    const [reasons, setReasons] = useState([])
    const toast = useToast()
    // const {doctor} = useContext(AppContext)

    useEffect(() => {

        api.settings.fetchReasons().then((res) => {
            setReasons(JSON.parse(res.data).result)
        })
    }, [])

    function handleReasonChange(e) {
        setNewReason(e.target.value)
    }


    function updateReason() {
        onClose()

        api.token.updateReason({ id: item.tokenID, newReason }).then((res) => {

            toast({
                title: "Reason for visit updated",
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
            window.location.reload()
        }).catch(err => {
            toast({
                title: "An error occured",
                status: 'error',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
        })

    }


    return (
        <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit reason for visit</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Select reason</FormLabel>
                        <RadioGroup>
                            <VStack alignItems={"baseline"}>
                                {reasons.map((reason) => <Radio onChange={handleReasonChange} value={reason.reasonID}>{reason.name}</Radio>)}
                            </VStack>
                        </RadioGroup>

                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={updateReason}>
                        Ok
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}