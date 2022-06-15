import React, { useState } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    IconButton,
    useToast,
    HStack,
    Text,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa'
import api from '../../api';

// confirm deletion of staff profile


export const DetailsPopover = ({ item, current, setCurrent }) => {

    const [isOpen, setIsOpen] = useState(false)
    //const [file, setFile] = useState(item.fileNumber)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const toast = useToast()



    function handleDoubleClick(id) {
        let fileNo = window.prompt("Enter the file number")
        if (fileNo != null)
            editFileNumber(fileNo, id)
    }

    function editFileNumber(file, id) {
        api.token.editFileNumber({ value: file, id }).then((res) => {
            const response = JSON.parse(res.data).result
            window.location.reload()
        })
    }

    return (
        <Popover trigger="click" placement="bottom-end" isOpen={isOpen} onClose={close} preventOverflow={true}
            flip={true}  >
            <PopoverTrigger>
                <IconButton bg="transparent" icon={<FaEllipsisH />} style={{ cursor: "pointer" }} onClick={open}>
                </IconButton>
            </PopoverTrigger >
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <HStack spacing="auto" mx={5}>
                        {/* <Editable onSubmit={() => editFileNumber(item.patientID)} onChange={handleFile} value={file ? file : "File: ----"}>
                            <EditablePreview />
                            <EditableInput />
                        </Editable> */}
                        <Text placeholder='Add file' onDoubleClick={() => handleDoubleClick(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                        <Text> {item.type}</Text>
                        <Text>{item.phone.substring(2)}</Text>
                    </HStack>
                    <HStack spacing="3%" mt={1} mx={5}>
                    {item.timeInEst ? <HStack>
                            <Text fontWeight={"bold"}>TT:</Text>
                            <Text> {new Date('1970-01-01T' + item.timeInEst + 'Z')
                                .toLocaleTimeString('en-US',
                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}
                            </Text> </HStack> : ""}
                        {item.timeIn ? <HStack>
                            <Text fontWeight={"bold"}>IN:</Text>
                            <Text> {new Date('1970-01-01T' + item.timeIn + 'Z')
                                .toLocaleTimeString('en-US',
                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}
                            </Text> </HStack> : ""}
                        {item.timeOut ? <HStack>
                            <Text fontWeight={"bold"}>OUT:</Text>
                            <Text> {new Date('1970-01-01T' + item.timeOut + 'Z')
                                .toLocaleTimeString('en-US',
                                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}
                            </Text> </HStack> : ""}

                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )
}
