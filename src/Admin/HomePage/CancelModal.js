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
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../../api';
//ask for file number and no of days after which review is required



export const CancelModal = (props) => {

    const { item, isOpen, onClose, setIsLoading } = props
    const [reason, setReason] = useState("")
    const toast = useToast()


  

    function handleReasonChange(e) {
        setReason(e.target.value)
    }



    function cancel() {
            setIsLoading(true)
            api.token.cancelToken({ item, reason }).then((res) => {
                setIsLoading(false)
                toast({
                    title: 'Cancelled token successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                    position: "top"
                })
                window.location.reload()
            }).catch((err) => {
                toast({
                    title: 'Something went wrong',
                    status: 'error',
                    duration: 3000,
                    isClosable: false,
                    position: "top"
                })
            })
        
       
    }




    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Warning!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text mb={4} fontSize={"lg"}>{`You are going to cancel token ${item.slot}-${item.tokenNumber} of ${item.name}`}</Text>
                    <FormControl>
                        <FormLabel>Reason for cancellation</FormLabel>
                            <Input type="text" value={reason} onChange={handleReasonChange} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={cancel}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}