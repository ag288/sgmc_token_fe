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
    Table,
    TableContainer,
    Tr,
    Th,
    Td,
    Heading,
    Box
} from '@chakra-ui/react';
import { useContext, useState, useEffect } from 'react';
import api from '../../api';
import { AppContext } from '../../App';
import { CloseIcon } from '@chakra-ui/icons'
import { FullPageSpinner } from '../../components/Spinner';
//ask for file number and no of days after which review is required



export const ArrivalModal = (props) => {

    const { list, setList, isOpen, onClose, setFlag } = props
    const [isLoading, setIsLoading] = useState(false)
    const [arrived, setArrived] = useState(false)

    useEffect(() => {



    }, [list])

    function tokenNumber(item) {

        let tokenNumber = ""
        if (item.slot?.includes("W")) {
            if (item.tokenNumber)
                tokenNumber += `${item.initials}W-${item.tokenNumber}`
            else
                tokenNumber += `W`
        }

        else
            tokenNumber += `${item.initials}-${item.tokenNumber} `
        if (item.oldTokenNumber)
            tokenNumber += `/${item.oldTokenNumber}`
        if (item.blockedNum)
            tokenNumber += `,${item.blockedNum}`
        return tokenNumber
    }

    function setAsArrived(item) {

        setIsLoading(true)
        api.token.setAsArrived({ item }).then((res) => {
            setIsLoading(false)
            // setPrintItem(JSON.parse(res.data).result)
            setFlag(prev => prev + 1)
            onClose()
        }).catch((err) => {
            setIsLoading(false)
            window.alert(err)
        })

    }

    function setAllAsArrived() {

        setIsLoading(true)
        api.token.setAllAsArrived(list).then((res) => {
            setIsLoading(false)
            setFlag(prev => prev + 1)
            setArrived(true)
            setList(JSON.parse(res.data).result)
        }).catch((err) => {
            setIsLoading(false)
            window.alert(err)
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {list?.length > 0 ?
                        isLoading ? <FullPageSpinner /> :
                            <TableContainer overflow="scroll">
                                <Table>
                                    <Tr>
                                        <Th >Token No</Th>
                                        <Th>Name</Th>
                                        <Th>Doctor</Th>
                                        <Th></Th>
                                    </Tr>
                                    {list?.map((i) =>
                                        <Tr>
                                            <Td color={arrived ? "green" : "black"}
                                                fontWeight={arrived ? "bold" : "normal"}>
                                                {tokenNumber(i)}</Td>
                                            <Td>{i.patient}</Td>
                                            <Td>{i.doctor}</Td>
                                            <Td>
                                                {!arrived && <Button colorScheme="blue" 
                                                onClick={()=>setAsArrived(i)}>Arrived
                                                </Button>}
                                            </Td>
                                        </Tr>
                                    )}
                                </Table>
                            </TableContainer>
                        : <Box textAlign="center" py={10} px={6}>
                            <CloseIcon boxSize={'20px'} color={'red'} />
                            <Heading size="md" mt={6} mb={2}>
                                No Arrivals
                            </Heading>
                        </Box>}
                </ModalBody>
                <ModalFooter>
                    {list?.length > 0 && !arrived &&
                        <Button mx={20} colorScheme="blue" isLoading={isLoading}
                        onClick={setAllAsArrived}>Mark All as Arrived</Button>}

                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}