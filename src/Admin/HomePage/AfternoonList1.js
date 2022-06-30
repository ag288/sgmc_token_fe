
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
    Text,
    VStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DiffMinutes, filterList, findBg } from '../../utils/tokenFunctions';
import { DetailsPopover } from './DetailsPopover';
import { ButtonPopover } from './Popover';
import api from '../../api';

// List of staff profiles pending approval

export const AfternoonList = ({ isLoading, setIsLoading, aftlist, current, setCurrent }) => {

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

  

    return (
        <>

            <HStack spacing={"auto"}>
                <Heading size="md">Morning</Heading>
                <Checkbox onChange={handleChange} colorScheme={"blue"} borderColor={"black"} size={"md"}>Show all</Checkbox>
            </HStack>
            <Box
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={0}
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
                            
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterList(aftlist, showCompleted).map((item, index) =>
                            <Tr key={index} bg={findBg(item)}>
                                <Td width={"10%"}><ButtonPopover loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                                <Td width={"25%"} >{`${item.slot}-${item.tokenNumber}`}</Td>
                                <Td width="10%">{types[item.type]}</Td>
                                <Td width={"25%"}>{item.name}</Td>
                                <Td width={"10%"}>
                                    <VStack>
                                    <DetailsPopover current={current} setCurrent={setCurrent} item={item} />
                                    <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item}/>
                                    {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                                    </VStack>
                                </Td>
                                
                            </Tr>
                        )
                        }
                    </Tbody>
                </Table>
            </Box>

        </>
    )
}
