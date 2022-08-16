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

//ask for file number and no of days after which review is required



export const DuplicatesModal = (props) => {

    const { item, isOpen, onClose, setIsLoading } = props
    // const [reason, setReason] = useState("")
    const toast = useToast()
    // const {doctor} = useContext(AppContext)






    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Warning!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={4} fontSize={"lg"}>Select the patient you want to keep</Text>
                    <RadioGroup>
                        <VStack alignItems={"baseline"}>
                            {item.map((patient) => <Radio>{`${patient.name} - ${patient.phone}`}</Radio>)}
                        </VStack>
                    </RadioGroup>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}