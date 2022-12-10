import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import "../utils/phone.css"
import { FullPageSpinner } from './Spinner'

export const CreatePatient = ({ isOpen, onClose, token, setToken, settings, reasons, navigateTo }) => {

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    function handleNewNameChange(e) {

        setToken(prev => ({ ...prev, "new_name": e.target.value }))
    }


    function handleFileChange(e) {
        setToken(prev => ({ ...prev, "fileNumber": e.target.value }))

    }

    function handlePhoneChange(e) {

        setToken(prev => ({ ...prev, "phone": e }))

    }

    function handleSubmit() {
        console.log(token)

        if (token.new_name != "" && token.phone != "") {

            setIsLoading(true)
            api.book.createPatient({ token }).then((res) => {
                setIsLoading(false)
                const response = JSON.parse(res.data).result
                setToken(prev => ({ ...prev, "id": response }))
                console.log(response)
                navigate(navigateTo, { state: { token, id: response, settings, reasons } })

            })
        }

        else {
            alert("Please fill in all the values")
        }

    }

    return (
        <>


            <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    {isLoading ? <FullPageSpinner /> : <ModalBody>
                        <Box rounded="lg" p={2}>
                            <HStack width={"full"} spacing="5" mt={5}>

                                <FormControl>
                                    <FormLabel>Patient Name</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleNewNameChange}
                                        value={token.new_name} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Patient Phone No.</FormLabel>
                                    <PhoneInput
                                        border={"2px"}
                                        international={true}
                                        countryCallingCodeEditable={false}
                                        value={token.phone}
                                        defaultCountry="IN"
                                        onChange={handlePhoneChange} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>File Number</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleFileChange}
                                        value={token.fileNumber} />
                                </FormControl>
                            </HStack>
                        </Box>
                    </ModalBody>
                    }
                    <ModalFooter>
                        <Button isLoading={isLoading} colorScheme='blue' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button isLoading={isLoading}
                            colorScheme='blue' onClick={handleSubmit} variant='outline'>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}