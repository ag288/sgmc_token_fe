import React, { useContext, useRef, useState } from 'react'
import {
    Button, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    HStack,
    IconButton,
    useToast,
    useDisclosure,
    Text,
    Box,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import api from '../../api';
import { ReviewModal } from './ReviewModal';
import { AppContext } from '../../App';
import { CancelModal } from './CancelModal';
import { useNavigate } from 'react-router-dom';
import { FaPrint } from 'react-icons/fa';
import { ComponentToPrint } from './TokenPrint';
import ReactToPrint from 'react-to-print';
import settingsApi from '../../api/settings';
// confirm deletion of staff profile


export const ButtonPopover = ({ isLoading, setIsLoading, settings, item, current, setCurrent, doctor }) => {

    const [opened, setOpened] = useState(false)
    const [origin, setOrigin] = useState("")
    const open = () => setOpened(!opened)
    const close = () => setOpened(false)
    const { user } = useContext(AppContext)
    const toast = useToast()
    const navigate = useNavigate()

    const { isOpen: isOpenReview, onOpen: onOpenReview, onClose: onCloseReview } = useDisclosure()
    const { isOpen: isOpenCancel, onOpen: onOpenCancel, onClose: onCloseCancel } = useDisclosure()
   

    function onCall() {
        // if (current) {
        //     setOrigin("call")
        //     onOpenReview()
        // }
        // else {
        const confirm = window.confirm(`You are going to call ${item.name}`)
        if (confirm)
            call()
        // }
    }

    function call() {
        //console.log(doctor)
        toast({
            title: `Calling ${item.name}`,
            status: 'info',
            duration: 3000,
            isClosable: false,
            position: "top"
        })
        setIsLoading(true)
        api.token.callNewToken({ current, item, doctor }).then((res) => {
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

    function onCompleted() {
        const confirm = window.confirm(`You are going to mark ${item.name} as completed`)
        if (confirm) {
            console.log(settings)
            if (settings.enableReview) {
                setOrigin("completed")
                onOpenReview()

            }
            else {
                completed()
            }
        }
    }

    function completed() {

        setIsLoading(true)
        api.token.setAsCompleted().then((res) => {
            setIsLoading(false)
            window.location.reload()
        }
        )

    }

    function onPrevious() {
        setOrigin("previous")
        onOpenReview()
    }


    return (
        <>
            <Popover trigger="click" placement="bottom-end" isOpen={opened} onClose={close} preventOverflow={true}
                flip={true}  >
                <PopoverTrigger>
                    <IconButton bg="transparent" icon={<HamburgerIcon />} style={{ cursor: "pointer" }} onClick={open}>
                    </IconButton>
                </PopoverTrigger >
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <HStack>
                            {/* <Button mx="1%" colorScheme={"yellow"} onClick={arrived} >Arrived</Button> */}
                            <Button width={"sm"} isDisabled={item.status == "cancelled" || item.status == "completed" || current} colorScheme={"green"} onClick={onCall} >Call</Button>
                            <Button width={"sm"} isDisabled={item.status == "current" || item.status == "completed"} colorScheme={"red"} onClick={onOpenCancel} >Cancel</Button>
                            <Button isDisabled={item.status != "current"} width={"sm"} colorScheme={"yellow"} onClick={onCompleted} >Done</Button>
                            <Button href={`tel:+${item.phone}`} as={"a"} width="sm" colorScheme={"blue"} className="nav-linker" >Dial</Button>
                            {/* <ReactToPrint
                            trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                            content={() => componentRef}
                        />
                         <div style={{ display: "none" }}>
                            <ComponentToPrint ref={(el) => (componentRef = el)} item={item} />
                        </div> */}
                        </HStack>
                        {/* <Box align='center' mt={"2%"}>
                            <Text style={{ cursor: "pointer", textDecoration: "underline" }} onClick={onPrevious} >Add review</Text>
                        </Box> */}
                        {user.userID == 2 && <Box align='center' mt={"2%"}>
                            <Text style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/book-review", { state: { item } })} >Add review</Text>
                        </Box>}
                    </PopoverBody>
                </PopoverContent>
            </Popover >
            <ReviewModal isOpen={isOpenReview} onClose={onCloseReview} item={item} doctor={doctor} current={current} isLoading={isLoading}
                setIsLoading={setIsLoading} origin={origin} />
            <CancelModal isOpen={isOpenCancel} onClose={onCloseCancel} doctor={doctor} item={item} setIsLoading={setIsLoading} />
        </>
    )

}

