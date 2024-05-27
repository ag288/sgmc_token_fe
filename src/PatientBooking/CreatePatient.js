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
    useMediaQuery,
    VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import "../utils/phone.css"
import { FullPageSpinner } from '../components/Spinner'

export const CreatePatient = ({ isOpen, onClose, info, setInfo, setPatientSelect}) => {

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    function handleNewNameChange(e) {

        setInfo(prev => ({ ...prev, "new_name": e.target.value }))
    }


    function handleFileChange(e) {
        setInfo(prev => ({ ...prev, "fileNumber": e.target.value }))

    }

    function handlePhoneChange(e) {
console.log(e)
        setInfo(prev => ({ ...prev, "phone": e }))

    }

    function handleSubmit() {
        console.log(info)

        if (info.new_name != "" && info.phone != "") {

            setIsLoading(true)
            api.book.createPatient({ info }).then((res) => {
                setIsLoading(false)
                const response = JSON.parse(res.data).result
                setInfo(prev => ({ ...prev, "id": response }))
                console.log(response)
                setPatientSelect(true)

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
                    {isLoading ? <FullPageSpinner /> : <ModalBody>
                        {isLaptop ? <Box rounded="lg" p={2}>
                            <HStack width={"full"} spacing="5" mt={5}>
                               
                                <FormControl>
                                    <FormLabel>Patient Name</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleNewNameChange}
                                        value={info.new_name} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Patient Phone No.</FormLabel>
                                    <PhoneInput
                                        border={"2px"}
                                        international={true}
                                        countryCallingCodeEditable={false}
                                        value={info.phone}
                                        defaultCountry="IN"
                                        onChange={handlePhoneChange} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>File Number</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleFileChange}
                                        value={info.fileNumber} />
                                </FormControl>
                            </HStack>
                        </Box> :
                            <VStack width={"full"} mt={5}>
                                <FormControl>
                                    <FormLabel>Patient Phone No.</FormLabel>
                                    <PhoneInput
                                        border={"2px"}
                                        international={true}
                                        countryCallingCodeEditable={false}
                                        value={info.phone}
                                        defaultCountry="IN"
                                        onChange={handlePhoneChange} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Patient Name</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleNewNameChange}
                                        value={info.new_name} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>File Number</FormLabel>
                                    <Input borderColor={"black"} type="text" onChange={handleFileChange}
                                        value={info.fileNumber} />
                                </FormControl>
                            </VStack>}
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