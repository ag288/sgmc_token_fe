
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
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';


// List of staff profiles pending approval

export const MorningList = ({ isLoading, setIsLoading, mornlist, current, setCurrent }) => {

    //const [mornlist, setMornList] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
    useEffect(() => {

    }, []);

    function handleChange() {
        setShowCompleted(!showCompleted)
    }

    function filterList(list) {
        return list.filter(item => {
            if (item.status != "cancelled") {
                if (item.status == "completed" && showCompleted) {
                    return true
                }
                else if (item.status == "completed" && !showCompleted) {
                    return false
                }
                else return true
            }
        })
    }

    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Morning</Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show completed</Checkbox>
            </HStack>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={3}
                width='auto'>
                <Table size="sm" variant='striped' colorScheme='grey'>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Token
                            </Th>
                            <Th>Type</Th>
                            <Th>Name</Th>
                            <Th></Th>
                            {/* <Th>File No.</Th>
                                <Th>Type</Th>
                                <Th>In</Th>
                                <Th>Out</Th> */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterList(mornlist).map((item, index) =>
                            <Tr key={index} bg={item.status == "completed" ? "gray.200" : (item.status == "current" ? "green.100" : "white")}>
                                <Td width={"10%"}><ButtonPopover loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td width={"25%"} >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td width="10%">{types[item.type]}</Td>
                                <Td width={"35%"}>{item.name}</Td>
                                <Td width={"10%"}><DetailsPopover current={current} setCurrent={setCurrent} item={item} /></Td>

                            </Tr>
                        )
                        }
                    </Tbody>
                </Table>
            </Box>

        </>
    )
}
