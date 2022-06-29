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
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../../api';
//ask for file number and no of days after which review is required



export const ReviewModal = (props) => {

    const { item, current, isOpen, onClose, isLoading, setIsLoading, origin } = props
    console.log(current)
    const [info, setInfo] = useState({
        file: "",
        days: 0
    })
    const toast = useToast()


    function handleFileChange(e) {
        setInfo(prev => ({ ...prev, "file": e.target.value }))
    }

    function handleDaysChange(e) {
        setInfo(prev => ({ ...prev, "days": e.target.value }))
    }

    function call() {
        toast({
            title: `Calling ${item.name}`,
            status: 'info',
            duration: 3000,
            isClosable: false,
            position: "top"
        })
        setIsLoading(true)
        api.token.callNewToken({ item }).then((res) => {
            // setCurrent(item)
            setIsLoading(false)
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

    function completed() {

        setIsLoading(true)
        api.token.setAsCompleted().then((res) => {
            setIsLoading(false)
            window.location.reload()
        }
        )

    }

    function saveReview() {
        onClose()
        let id = origin == "previous" ? item.patientID : current.patientID
        if (!(info.file == "" && info.days == 0)) {
            api.token.saveReview({ id: id, info }).then((res) => {
                //window.location.reload()
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
        if (origin == "call")
            call()
        else if (origin == "completed")
            completed()
    }




    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{origin == "previous" ? item.name : current.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {origin == "previous" && item.fileNumber == null || origin != "previous" && current.fileNumber == null ? <FormControl>
                        <FormLabel>File number</FormLabel>
                        <Input type="text" value={info.file} onChange={handleFileChange}></Input>
                    </FormControl> : null}
                    <FormControl>
                        <FormLabel>Review after</FormLabel>
                        <InputGroup>
                            <Input type="number" value={info.days} onChange={handleDaysChange} />
                            <InputRightAddon>days</InputRightAddon>
                        </InputGroup>

                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={saveReview}>
                        Save
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}