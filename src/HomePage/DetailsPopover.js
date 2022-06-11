import React, { useState } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    
    PopoverBody,
  
    PopoverArrow,
    PopoverCloseButton,
    IconButton,
    Tr,
    Td,
    useToast,
    Editable,
    EditablePreview,
    EditableInput,
    Table,
    Thead,
    Tbody,
    Th,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa'
import api from '../api';

// confirm deletion of staff profile


export const DetailsPopover = ({ item, current, setCurrent }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState(item.fileNumber)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const toast = useToast()

    function handleFile(value) {
        setFile(value)
    }

    function editFileNumber(id) {
        api.token.editFileNumber({ file, id }).then((res) => {
            const response = JSON.parse(res.data).result
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
                    <Table size={"sm"}>
                        <Thead>
                            <Tr>
                                <Th >File</Th>
                                <Th>Type</Th>
                                <Th>In</Th>
                                <Th>Out</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td><Editable onSubmit={() => editFileNumber(item.patientID)} onChange={handleFile} value={file}>
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable></Td>
                                <Td > {item.type}</Td>
                                <Td>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                                    .toLocaleTimeString('en-US',
                                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                </Td>
                                <Td> {item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                                    .toLocaleTimeString('en-US',
                                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )

}

