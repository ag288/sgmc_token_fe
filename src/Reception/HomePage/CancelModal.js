import {
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Text,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import api from '../../api';
import { AppContext } from '../../App';
//ask for file number and no of days after which review is required



export const CancelModal = (props) => {

    const { item, isOpen, onClose, setIsLoading,doctor } = props
    const [reason, setReason] = useState("")
    const toast = useToast()
   // const {doctor} = useContext(AppContext)

  

    function handleReasonChange(e) {
        setReason(e.target.value)
    }



    function cancel() {
            setIsLoading(true)
            api.token.cancelToken({ item, reason, doctor }).then((res) => {
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
                  <Text mb={4} fontSize={"lg"}>{`You are going to cancel token ${item.initials}-${item.tokenNumber} of ${item.name}`}</Text>
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