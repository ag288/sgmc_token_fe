import React, { useState } from 'react'
import {
    Box, Button, Modal, Text, useDisclosure, VStack, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    HStack,
    IconButton,
    Tr,
    Td,
} from '@chakra-ui/react';
import { CheckIcon, SettingsIcon } from '@chakra-ui/icons';
import api from '../api';

// confirm deletion of staff profile


export const ButtonPopover = ({ item, current, setCurrent }) => {

    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)

    function call() {
        setCurrent(`${item.slot}-${item.tokenNumber}`)
        localStorage.setItem("current", `${item.slot}-${item.tokenNumber}`)
        //localStorage.setItem("slot", item.slot)
        close()
    }

    function cancel() {
        console.log("hi")
        api.token.cancelToken({ item }).then((res) => {
            const response = JSON.parse(res.data)
            window.location.reload()
        })
    }

    function completed() {
        api.token.setAsCompleted({ item }).then((res) => {
            const response = JSON.parse(res.data)
            window.location.reload()
        })
    }

    return (
        <Popover trigger="click" placement="left" isOpen={isOpen} onClose={close} >
            <PopoverTrigger>
                <IconButton isDisabled={item.status == "completed"} bg="transparent" icon={<SettingsIcon />} style={{ cursor: "pointer" }} onClick={open}>
                </IconButton>
            </PopoverTrigger >
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <HStack spacing={"auto"}>
                        <Button mx="1%" colorScheme={"blue"} onClick={call} >Call</Button>
                        <Button mx="1%" colorScheme={"blue"} onClick={cancel} variant="outline" >Cancel</Button>
                        <Button mx="1%" colorScheme={"blue"} onClick={completed} >Completed</Button>
                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )

}

