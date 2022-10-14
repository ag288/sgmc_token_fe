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

    const { item, isOpen, onClose, flag, setState } = props
    const [newReason, setNewReason] = useState()
    const [reasons, setReasons] = useState([])
    const toast = useToast()
    // const {doctor} = useContext(AppContext)

    useEffect(() => {

        api.settings.fetchReasons().then((res) => {
            const response = JSON.parse(res.data).result
            setReasons(response)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function handleReasonChange(e) {
        setNewReason(e.target.value)
    }


    function updateReason() {
        onClose()
        // flag == 1 ---> editing reason of daily token
        // flag == 2 ---> editing reason of review token
        api.token.updateReason({ id: flag == 1 ? item.tokenID : item.reviewID, newReason, flag }).then((res) => {
            item.reason = newReason
            item.type = reasons.find((r) => r.reasonID == newReason).name
            toast({
                title: "Reason for visit updated",
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: "top"
            })
            setState(prev => prev + 1) // to re-render parent component to reflect the changes in reason
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
                                {reasons.map((reason) => <Radio bg={newReason == reason.reasonID ? "green" : "white"} onChange={handleReasonChange} value={reason.reasonID}>{reason.name}</Radio>)}
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