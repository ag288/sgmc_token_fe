import React, { useContext, useState } from 'react'
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
import { FaEllipsisH, FaEllipsisV, FaSortDown } from 'react-icons/fa'
import api from '../../api';
import { diffMinutes } from '../../utils/tokenFunctions';
import { AppContext } from '../../App';

// confirm deletion of staff profile


export const DetailsPopover1 = ({ item, current, setCurrent, doctor }) => {

    const [isOpen, setIsOpen] = useState(false)
    //const [file, setFile] = useState(item.fileNumber)
    const open = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)
    const toast = useToast()
    const { user } = useContext(AppContext)


    function handleDoubleClick(id) {
       
            let fileNo = window.prompt("Enter the file number")
            if (fileNo != null)
                editFileNumber(fileNo, id)
        
    }

    function editFileNumber(file, id) {
        api.token.updateInfo({ key:"fileNumber",value: file, id }).then((res) => {
            const response = JSON.parse(res.data).result
            window.location.reload()
        })
    }

    return (
        <Popover trigger="click" placement="bottom-end" isOpen={isOpen} onClose={close} preventOverflow={true}
            flip={true}  >
            <PopoverTrigger>
                <IconButton bg="transparent" icon={<FaEllipsisV />} style={{ cursor: "pointer" }} onClick={open}>
                </IconButton>
            </PopoverTrigger >
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <HStack spacing="auto" mr={5}>
                        {/* <Editable onSubmit={() => editFileNumber(item.patientID)} onChange={handleFile} value={file ? file : "File: ----"}>
                            <EditablePreview />
                            <EditableInput />
                        </Editable> */}
                        <Text fontWeight={"bold"}>File:</Text>
                        <Text placeholder='Add file' 
                       >{item.fileNumber ? item.fileNumber : "----"}</Text>
                        <Text fontWeight={"bold"}>Phone:</Text>
                        <Text>{item.phone?.substring(2)}</Text>
                    </HStack>
                    {/* <HStack mt={1} mr={5}>
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
                            
                    </HStack> */}
                    {/* <HStack mt={1} mr={5}>
                        <HStack>
                            <Text fontWeight={"bold"}>DIFF:</Text>
                            <Text color={diffMinutes(item.timeIn, item.timeInEst).includes("-")? "red" : "green"} >{diffMinutes(item.timeIn, item.timeInEst)} </Text>
                        </HStack> 
                    </HStack>*/}
                </PopoverBody>
            </PopoverContent>
        </Popover >
    )
}

