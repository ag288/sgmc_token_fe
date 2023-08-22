import { Box, Button, Divider, HStack, IconButton, Td, Text, Tr, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useRef, useState } from "react"
import api from "../api"
import { compareFn, DiffMinutes, findBg, types } from "../utils/tokenFunctions"
import "../components/icon.css"
import { DetailsPopover1 } from "../Reception/HomePage/DetailsPopover1"

export const ListComponent = ({ doctor, item, index, desktopView }) => {


    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [settings, setSettings] = useState([])


    useEffect(() => {

        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
    }, [])



    function decideArrival() {
        let str = ""
        if (item.time_of_arrival) {
            str = `${new Date('1970-01-01T' + item.time_of_arrival + 'Z')
                .toLocaleTimeString('en-US',
                    { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' })}`
            let arrival = new Date(), estTime = new Date()
            const [hrs, mins, secs] = item.time_of_arrival.split(":")
            arrival.setHours(hrs, mins, 0)
            if (item.timeInEst) {
                const [hrs_est, mins_est, secs_est] = item.timeInEst.split(":")

                estTime.setHours(hrs_est, parseInt(mins_est) + parseInt(settings.delay_minutes), 0)
            }
            if (item.timeInEst && compareFn(estTime, arrival)) {
                str += "🔴"
            }
            else {
                str += "🟢"
            }
        }
        else {
            if (item.status == "delayed")
                str += "🔴"
        }
        return str
    }

    function tokenNumber(item) {
        let tokenNumber = ""
        if (item.slot.includes("W")) {
            if (item.tokenNumber)
                tokenNumber += `${item.initials}W-${item.tokenNumber}`
            else
                tokenNumber += `W`
        }

        else
            tokenNumber += `${item.initials}-${item.tokenNumber} `
        if (item.oldTokenNumber)
            tokenNumber += `/${item.oldTokenNumber}`
        if (item.blockedNum)
            tokenNumber += `,${item.blockedNum}`
        return tokenNumber
    }

    return (
        isLaptop || desktopView ?


            <Tr key={index} bg={findBg(item)} >
                <Td >{tokenNumber(item)}</Td>
                {/* <Td>
                    {item.tokenCount ? `${item.name}(${item.tokenCount})` : item.name}</Td> */}
                <Td>{item.name}</Td>

                <Td><Text placeholder='Add file'>
                    {item.fileNumber ? item.fileNumber : "----"}</Text>
                </Td>
                <Td > {item.type}</Td>
                {/* <Td>{item.phone}</Td> */}
                <Td>
                    <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                        .toLocaleTimeString('en-US',
                            { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                    </Text>
                </Td>
                <Td >{decideArrival()}</Td>
                <Td>{item.timeIn &&
                    <VStack alignItems={"baseline"}>
                        <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                        {item.timeInEst && <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />}
                    </VStack>}</Td>
                <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                    .toLocaleTimeString('en-US',
                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                </Td>



            </Tr> : <Box bg={findBg(item)} rounded="lg" p={1} mb={2} >
                <HStack spacing={"auto"}>

                    <Text color="green" minW={"max-content"} fontWeight={"bold"}>{tokenNumber(item)}
                    </Text>
                    <Text noOfLines={1} fontWeight={"bold"}>{item.name}
                    </Text>

                    <Text >{item.fileNumber}
                    </Text>
                    <Text >{types[item.type]}
                    </Text>
                    {/* <DetailsPopover1 doctor={doctor} current={current} setCurrent={setCurrent} item={item} /> */}

                </HStack>

                <HStack alignItems="start" spacing="auto" height={"50"}>
                    <VStack spacing={0}>
                        <Text fontWeight={"bold"}>Time</Text>
                        <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                    <VStack spacing={0}>
                        <Text fontWeight={"bold"}>Arrival</Text>

                        <Text>{decideArrival()}
                        </Text>
                    </VStack>
                    <VStack spacing={0}>
                        <Text fontWeight={"bold"}>In</Text>
                        <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                    <VStack spacing={0}>
                        <Text fontWeight={"bold"}>Out</Text>
                        <Text>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                </HStack>


            </Box>




    )
}