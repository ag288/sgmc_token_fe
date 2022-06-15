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
    Td,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import api from '../../api';
import { FaPhoneAlt } from 'react-icons/fa';
// confirm deletion of staff profile


export const ButtonPopover = ({ isLoading, setIsLoading, item, current, setCurrent }) => {

    const [isOpen, setIsOpen] = useState(false)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const toast = useToast()

    function arrived() {
        api.token.setAsArrived({ item }).then((res) => {
            const response = JSON.parse(res.data)
            window.location.reload()
        })
    }

    function call() {
        let file = null, call = false
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
        else {
            close()
        }
        // localStorage.setItem("current", `${item.slot}-${item.tokenNumber}`)
        //localStorage.setItem("slot", item.slot)
        //close()
    }

    function completed() {

        let flag = window.confirm("Do you want to mark this token as completed?")
        if (flag) {
            setIsLoading(true)
            api.token.setAsCompleted().then((res) => {
                setIsLoading(false)
                window.location.reload()
            }
            )
        }
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
        <Popover trigger="click" placement="bottom-end" isOpen={isOpen} onClose={close} preventOverflow={true}
            flip={true}  >
            <PopoverTrigger>
                <IconButton isDisabled={item.status == "completed" || item.status == "cancelled"} bg="transparent" icon={<HamburgerIcon />} style={{ cursor: "pointer" }} onClick={open}>
                </IconButton>
            </PopoverTrigger >
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <HStack>
                        {/* <Button mx="1%" colorScheme={"yellow"} onClick={arrived} >Arrived</Button> */}
                        <Button width={"sm"} colorScheme={"green"} onClick={call} >Call</Button>
                        <Button width={"sm"} colorScheme={"red"} onClick={cancel} >Cancel</Button>
                        <Button  isDisabled={item.status!="current"} width={"sm"} colorScheme={"yellow"} onClick={completed} >Done</Button>
                        <Button href={`tel:+${item.phone}`} as={"a"} width="sm" colorScheme={"blue"} className="nav-linker" >Dial</Button>

                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )

}

