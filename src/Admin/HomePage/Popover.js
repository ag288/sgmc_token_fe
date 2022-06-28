import React, { useState } from 'react'
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
// confirm deletion of staff profile


export const ButtonPopover = ({ isLoading, setIsLoading, item, current, setCurrent }) => {

    const [opened, setOpened] = useState(false)
    const [origin, setOrigin] = useState("")
    const open = () => setOpened(!opened)
    const close = () => setOpened(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()


    function onCall() {
        if (current){
            setOrigin("call")
            onOpen()
        }
        else {
            const confirm = window.confirm(`You are going to call ${item.name}`)
            if (confirm)
                call()
        }
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
        api.token.callNewToken({ current, item }).then((res) => {
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

    function onCompleted(){
        setOrigin("completed")
        onOpen()
    }

    
    function cancel() {
        let flag = window.confirm(`WARNING!!\n\nYou are going to cancel token ${item.slot}-${item.tokenNumber} of ${item.name}`)
        if (flag) {
            setIsLoading(true)
            api.token.cancelToken({ item }).then((res) => {
                const response = JSON.parse(res.data)
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

        else {
            close()
        }
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
                            <Button width={"sm"} isDisabled={item.status=="current"} colorScheme={"green"} onClick={onCall} >Call</Button>
                            <Button width={"sm"} colorScheme={"red"} onClick={cancel} >Cancel</Button>
                            <Button isDisabled={item.status != "current"} width={"sm"} colorScheme={"yellow"} onClick={onCompleted} >Done</Button>
                            <Button href={`tel:+${item.phone}`} as={"a"} width="sm" colorScheme={"blue"} className="nav-linker" >Dial</Button>
                        </HStack>
                        {/* <Box align='center' mt={"2%"}>
                    <Text style={{cursor : "pointer", textDecoration:"underline"}} onClick={onOpen} >Add review</Text>
                    </Box> */}
                    </PopoverBody>
                </PopoverContent>
            </Popover >
            <ReviewModal isOpen={isOpen} onClose={onClose} item={item} current={current} isLoading={isLoading}
                setIsLoading={setIsLoading}  origin={origin} />
        </>
    )

}

