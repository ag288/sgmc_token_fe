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
    Spinner,
} from '@chakra-ui/react';
import { CheckIcon, HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import api from '../api';

// confirm deletion of staff profile


export const ButtonPopover = ({ isLoading, setIsLoading, item, current, setCurrent }) => {

    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)

    function arrived() {
        api.token.setAsArrived({ item }).then((res) => {
            const response = JSON.parse(res.data)
            window.location.reload()
        })
    }

    function call() {
        let file = "", call = false
        if (item.fileNumber == null || item.fileNumber == "" || item.fileNumber == "N" || item.fileNumber == "n") {
            file = prompt("You are going to call " + item.name + "\nPlease enter the patient's file number")
            console.log(file)
        }
        else {
            call = window.confirm("You are going to call " + item.name)
        }
        if (file != null || call) {
            if (!item.fileNumber)
                item.fileNumber = file
            setIsLoading(true)
            api.token.callNewToken({ current, item }).then((res) => {
                // setCurrent(item)
                setIsLoading(false)
                window.location.reload()
            })
        }
        // localStorage.setItem("current", `${item.slot}-${item.tokenNumber}`)
        //localStorage.setItem("slot", item.slot)
        //close()
    }

    function cancel() {
        setIsLoading(true)
        api.token.cancelToken({ item }).then((res) => {
            const response = JSON.parse(res.data)
            setIsLoading(false)
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
        <Popover trigger="click" placement="left" isOpen={isOpen} onClose={close} preventOverflow={true}
            flip={true} >
            <PopoverTrigger>
                <IconButton isDisabled={item.status == "completed" || item.status == "current"} bg="transparent" icon={<HamburgerIcon />} style={{ cursor: "pointer" }} onClick={open}>
                </IconButton>
            </PopoverTrigger >
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <HStack spacing={"auto"}>
                        {/* <Button mx="1%" colorScheme={"yellow"} onClick={arrived} >Arrived</Button> */}
                        <Button mx="2%" width={"sm"} colorScheme={"green"} onClick={call} >Call</Button>
                        <Button mx="2%" width={"sm"} colorScheme={"red"} onClick={cancel} >Cancel</Button>

                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )

}

