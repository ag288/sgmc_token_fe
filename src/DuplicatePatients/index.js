
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    HStack,
    Heading,
    Checkbox,
    VStack,
    Editable,
    EditablePreview,
    EditableInput,
    Text,
    Flex,
    Stack,
    IconButton,
    useToast,
    Button,
    Icon,
    Divider,
    Select,
    useDisclosure,
    RadioGroup,
    Radio,
    MenuItemOption,
    ButtonGroup,
    useEditableControls,
    Input,
    Alert,
    AlertIcon
} from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import api from '../api';
import { ArrowBackIcon, CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FullPageSpinner } from '../components/Spinner';
import { FaEdit, FaPhoneAlt } from 'react-icons/fa';
import { useMediaQuery } from '@chakra-ui/react'
import { AppContext } from '../App';
import { DuplicatesModal } from './DuplicatesModal';

// List of staff profiles pending approval

export const DuplicatePatients = () => {
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [duplicatelist, setDuplicateList] = useState([])
    const [otherDuplicatesList, setOtherDuplicatesList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [merge, setMerge] = useState({ index: -1, i: -1 })
    const navigate = useNavigate()
    const { doctor, doctors, setDoctor } = useContext(AppContext)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        setIsLoading(true)
        api.token.fetchDuplicatePatients().then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data).result
            console.log(response.filter(r => ["R", "N", ""].includes(r.fileNumber)))
            setDuplicateList(response.filter(r => !(["R", "N", ""].includes(r.fileNumber))))
            setOtherDuplicatesList(response.filter(r => ["R", "N", ""].includes(r.fileNumber)))
        })
    }, [doctor]);



    function setAsMerge(index, i) {
        // let copy=merge
        // copy["index"]=index
        // copy["i"]=i
        // setMerge(copy)
        setMerge(prev => ({ ...prev, "index": index }))
        setMerge(prev => ({ ...prev, "i": i }))
    }


    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        return isEditing ? (
            // <ButtonGroup size='sm'>
            //     <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
            //     <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
            // </ButtonGroup>
            null

        ) : (
            <IconButton size='sm' icon={<FaEdit />} {...getEditButtonProps()} />

        )
    }

    function editFile(fileNumber, item) {
        if (fileNumber != item.fileNumber) {
            api.token.editFileNumber({ fileNumber, id: item.patientID }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
        }
    }

    return (
        <Flex bg="gray.100"
            minH={"100vh"}>
            {isLoading ? <FullPageSpinner /> :
                <>
                    {isLaptop && (duplicatelist.length != 0 || otherDuplicatesList.length != 0) && <>

                        {/* <IconButton size="lg" onClick={() => navigate(-1)} icon={<ArrowBackIcon />}></IconButton> */}

                        <Stack py={12} px={2} mx="auto" width="auto">

                            <Heading size="md">Duplicate Patients</Heading>
                            <Box>
                                <Alert mb={2} status='info'>
                                    <AlertIcon />
                                    Choose the patient you wish to keep by clicking on the patient name. Then click Merge to combine all duplicate entries.
                                </Alert >
                                <Alert mb={2} status='info'>
                                    <AlertIcon />
                                    Click on the edit button next to the file number to update the file number of the patient
                                </Alert>
                            </Box>
                            <Box
                                rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                p={3}
                                width='full'>

                                {duplicatelist.map((review, index) => <>

                                    <Divider mt={2} orientation='horizontal'></Divider>
                                    <Heading m={8} size="md" color="red">{`File Number: ${review.fileNumber}`}</Heading>

                                    <Table variant='striped' colorScheme='grey'>
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Primary Phone</Th>
                                                <Th>File Number</Th>

                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {duplicatelist[index].patients.map((item, i) =>

                                                <Tr bg={merge["i"] == i && merge["index"] == index ? "gray.200" : "transparent"} key={i}>
                                                    <Td style={{ cursor: "pointer" }} onClick={() => setAsMerge(index, i)} >{item.name}</Td>
                                                    <Td ><Text>{item.phone.substring(2)}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Editable
                                                            textAlign='center'
                                                            defaultValue={item.fileNumber}
                                                            isPreviewFocusable={false}
                                                            onSubmit={(fileNumber) => editFile(fileNumber, item)}
                                                        >
                                                            <HStack>
                                                                <EditablePreview />
                                                                {/* Here is the custom input */}

                                                                <Input as={EditableInput} />
                                                                <EditableControls />
                                                            </HStack>
                                                        </Editable></Td>

                                                </Tr>

                                            )
                                            }
                                        </Tbody>
                                    </Table>
                                    <DuplicatesModal isOpen={isOpen} isLoading={isLoading} setIsLoading={setIsLoading} onClose={onClose} item={merge["index"] != -1 ? duplicatelist[merge["index"]].patients[merge["i"]] : {}} />

                                    <Button mt={2} onClick={onOpen} colorScheme={"blue"} isDisabled={merge["index"] != index}>Merge</Button>

                                </>
                                )}

                            </Box>

                            <Box rounded={'lg'}
                                bg={'white'}
                                boxShadow={'lg'}
                                p={3}
                                width='full'>
                                {otherDuplicatesList.map((review, index) => <>

                                    <Divider mt={2} orientation='horizontal'></Divider>
                                    <Heading m={8} size="md" color="red">{`File Number: ${review.fileNumber ? review.fileNumber : "Empty"}`}</Heading>

                                    <Table variant='striped' colorScheme='grey'>
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Primary Phone</Th>
                                                <Th>File Number</Th>

                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {otherDuplicatesList[index].patients.map((item, i) =>

                                                <Tr key={i}>
                                                    <Td style={{ cursor: "pointer" }} onClick={() => setAsMerge(index, i)} >{item.name}</Td>
                                                    <Td ><Text>{item.phone.substring(2)}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Editable
                                                            textAlign='center'
                                                            defaultValue={item.fileNumber}
                                                            isPreviewFocusable={false}
                                                            onSubmit={(fileNumber) => editFile(fileNumber, item)}
                                                        >
                                                            <HStack>
                                                                <EditablePreview />
                                                                {/* Here is the custom input */}

                                                                <Input as={EditableInput} />
                                                                <EditableControls />
                                                            </HStack>
                                                        </Editable></Td>

                                                </Tr>

                                            )
                                            }
                                        </Tbody>
                                    </Table>

                                </>
                                )}
                            </Box>
                        </Stack>
                    </>}
                    {isMobile && (duplicatelist.length != 0 || otherDuplicatesList.length != 0) &&
                        <Stack width="full" alignItems="baseline" py={2} mx="2">
                            <IconButton size="lg" onClick={() => navigate(-1)} icon={<ArrowBackIcon />}></IconButton>

                            <Heading size="lg">Duplicate Patients</Heading>
                            <Box>
                                <Alert mb={2} status='info'>
                                    <AlertIcon />
                                    Choose the patient you wish to keep by clicking on the patient name. Then click Merge to combine all duplicate entries.
                                </Alert >
                                <Alert mb={2} status='info'>
                                    <AlertIcon />
                                    Click on the edit button next to the file number to update the file number of the patient
                                </Alert>
                            </Box>
                            {duplicatelist.map((item, index) =>
                                <><Heading size="md" color="red" pt={3}>{`File No: ${item.fileNumber}`}</Heading>
                                    {duplicatelist[index].patients.map((review, i) => <Box
                                        rounded={'lg'}
                                        boxShadow={'lg'}
                                        p={3}
                                        m={5}
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        bg={merge["i"] == i && merge["index"] == index ? "gray.200" : "white"}
                                        width='full'>
                                        <HStack spacing={"auto"}>
                                            <Heading onClick={() => setAsMerge(index, i)} size={"md"}>{review.name}</Heading>
                                            <HStack>
                                                <Editable
                                                    textAlign='center'
                                                    defaultValue={review.fileNumber}
                                                    isPreviewFocusable={false}
                                                    onSubmit={(fileNumber) => editFile(fileNumber, review)}
                                                >
                                                    <HStack>
                                                        <EditablePreview />
                                                        {/* Here is the custom input */}

                                                        <Input as={EditableInput} />
                                                        <EditableControls />
                                                    </HStack>
                                                </Editable>

                                            </HStack>
                                        </HStack>
                                    </Box>)
                                    }

                                    <DuplicatesModal isOpen={isOpen} isLoading={isLoading} setIsLoading={setIsLoading} onClose={onClose} item={merge["index"] != -1 ? duplicatelist[merge["index"]].patients[merge["i"]] : {}} />

                                    <Button mt={2} onClick={onOpen} colorScheme={"blue"} isDisabled={merge["index"] != index}>Merge</Button>

                                </>)}
                            {otherDuplicatesList.map((item, index) =>
                                <><Heading size="md" color="red" pt={3}>{`File No: ${item.fileNumber ? item.fileNumber : "Empty"}`}</Heading>
                                    {otherDuplicatesList[index].patients.map((review, i) => <Box
                                        rounded={'lg'}
                                        boxShadow={'lg'}
                                        bg="white"
                                        p={3}
                                        m={5}
                                        key={i}
                                        style={{ cursor: "pointer" }}
                                        width='full'>
                                        <HStack spacing={"auto"}>
                                            <Heading onClick={() => setAsMerge(index, i)} size={"md"}>{review.name}</Heading>
                                            <HStack>
                                                <Editable
                                                    textAlign='center'
                                                    defaultValue={review.fileNumber}
                                                    isPreviewFocusable={false}
                                                    onSubmit={(fileNumber) => editFile(fileNumber, review)}
                                                >
                                                    <HStack>
                                                        <EditablePreview />
                                                        <Input as={EditableInput} />
                                                        <EditableControls />
                                                    </HStack>
                                                </Editable>

                                            </HStack>
                                        </HStack>
                                    </Box>)
                                    }
                                </>)}
                        </Stack>
                    }
                    {duplicatelist.length == 0 && otherDuplicatesList.length==0 && <Flex bg="white" width="full" align="center" justify="center"><Heading size="lg">No Duplicate Patients</Heading></Flex>}
                </>}
        </Flex>
    )
}

