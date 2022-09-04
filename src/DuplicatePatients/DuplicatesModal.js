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
    RadioGroup,
    VStack,
    Radio,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import api from '../api';
import { FullPageSpinner } from '../components/Spinner';

//ask for file number and no of days after which review is required



export const DuplicatesModal = (props) => {

    const { item, isOpen, onClose, setIsLoading, isLoading } = props
    // const [reason, setReason] = useState("")
    const toast = useToast()
    // const {doctor} = useContext(AppContext)
    console.log(item)


    function mergePatients() {
        onClose()
        //setIsLoading(true)
        api.token.mergeDuplicatePatients({ item }).then((res) => {
            //  setIsLoading(false)
            window.location.reload()
        })
    }


    return (
        isLoading ? <FullPageSpinner /> : <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="red">Warning!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to merge the chosen entries?
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' onClick={mergePatients} mr={3} >
                        Ok
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}