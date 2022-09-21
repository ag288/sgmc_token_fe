import { Box, Button, Divider, HStack, IconButton, Td, Text, Tr, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useRef, useState } from "react"
import { FaCheck, FaPrint, FaRegFileWord, FaUndo, FaUserCheck, FaWalking } from "react-icons/fa"
import ReactToPrint from "react-to-print"
import api from "../../api"
import { AppContext } from "../../App"
import { QRScanner } from "../../QRScanning/QRScanner"
import { compareFn, DiffMinutes, findBg, types } from "../../utils/tokenFunctions"
import { DetailsPopover } from "./DetailsPopover"
import { DetailsPopover1 } from "./DetailsPopover1"
import { ButtonPopover } from "./Popover"
import { ReasonEditModal } from "./ReasonEditModal"
import { ComponentToPrint } from "./TokenPrint"
import "../../components/icon.css"

export const ListComponent = ({ isLoading, setIsLoading, current, setCurrent, doctor, item, index, next, desktopView }) => {

    const { user } = useContext(AppContext)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [settings, setSettings] = useState([])
const componentRef = useRef()
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        api.settings.fetchSettings({ doctor }).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
    }, [])

    function handleDoubleClickForFile(id) {
        let fileNumber = window.prompt("Enter the file number")
        if (fileNumber != null) {
            //  editFileNumber(fileNo, id)
            api.token.editFileNumber({ fileNumber, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
        }
    }

    function handleDoubleClickForName(id) {
        let name = window.prompt("Enter the patient's name")
        if (name != null) {
            api.token.editName({ name, id }).then((res) => {
                const response = JSON.parse(res.data).result
                window.location.reload()
            })
        }
    }

    function handleDoubleClickForReason() {
        if (user.userID == 2) {
            onOpen()
        }
    }

    function bookWalkIn() {
        api.token.bookWalkIn({ item }).then((res) => {
            window.location.reload()
        })
    }


    function setAsArrived() {

        api.token.setAsArrived({ item }).then((res) => {
            window.location.reload()
        })

    }

    function undoArrived() {


        const confirm = window.confirm("Are you sure you want to undo the arrived action?")
        if (confirm) {
            api.token.undoArrived({ item, doctor }).then((res) => {
                window.location.reload()
            })
        }

    }

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
            // if (item.status == "arrived") {
            //     let arrival = new Date()
            //     arrival.setHours(item.time_of_arrival.split(":")[0], item.time_of_arrival.split(":")[1], 0)

            //     if (item.timeInEst && compareFn(item.timeInEst, arrival)) {
            //         str += "🔴"
            //     }
            //     else {
            //         str += "🟢"
            //     }
            // }
        }
        return str
    }

    return (
        //         <Tr key={index} bg={findBg(item)}>
        //             <Td><ButtonPopover settings={settings} doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
        //             <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
        //             {isMobile && <Td>{types[item.type]}</Td>}
        //             <Td style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}</Td>

        //             {/* {isMobile && <Td>
        //                 <VStack>
        //                     <DetailsPopover doctor={doctor} current={current} setCurrent={setCurrent} item={item} />
        //                     <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
        //                 </VStack>
        //             </Td>} */}

        //              {isMobile && 
        //              <><Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
        //             </Td>


        //                 <Td>
        //                         <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
        //                             .toLocaleTimeString('en-US',
        //                                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                         </Text>
        //                 </Td>
        //                 <Td >{decideArrival()}</Td>
        //                 <Td>{item.timeIn &&
        //                     <VStack alignItems={"baseline"}>
        //                         <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
        //                             .toLocaleTimeString('en-US',
        //                                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                         </Text>
        //                        {item.timeInEst && <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />}
        //                     </VStack>}</Td>
        //                 <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
        //                     .toLocaleTimeString('en-US',
        //                         { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                 </Td>

        //                 <Td>{item.phone.substring(2)}</Td>
        //                 </>
        //                }

        //            {isLaptop &&
        //              <><Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
        //             </Td>
        //                 <Td> {item.type}</Td>
        //                 <Td>{item.phone.substring(2)}</Td>
        //                 <Td>
        //                         <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
        //                             .toLocaleTimeString('en-US',
        //                                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                         </Text>
        //                 </Td>
        //                 <Td >{decideArrival()}</Td>
        //                 <Td>{item.timeIn &&
        //                     <VStack alignItems={"baseline"}>
        //                         <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
        //                             .toLocaleTimeString('en-US',
        //                                 { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                         </Text>
        //                        {item.timeInEst && <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />}
        //                     </VStack>}</Td>
        //                 <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
        //                     .toLocaleTimeString('en-US',
        //                         { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
        //                 </Td>

        //                 </>
        //                }
        // { user.userID==2 && <Td>  <ReactToPrint
        //                     onAfterPrint={setAsArrived}
        //                     trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
        //                     content={() => componentRef.current}
        //                 />
        //                     <div style={{ display: "none" }}>  <ComponentToPrint ref={componentRef} item={item} />
        //                     </div>
        //                 </Td>}
        //         </Tr>




        isLaptop || desktopView ?


            <Tr key={index} bg={findBg(item)} className={next == item.tokenID ? "Blink" : ""}>
                <Td><ButtonPopover settings={settings} doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
                <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
                <Td style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}</Td>

                <Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
                </Td>
                <Td onDoubleClick={handleDoubleClickForReason}> {item.type}</Td>
                <Td>{item.phone.substring(2)}</Td>
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
                {user.userID == 2 && 
                <Td>
                    {item.status == "delayed" ?
                        <Button colorScheme={"blue"} onClick={bookWalkIn}>Book Walk-In</Button>
                        : (item.status == "arrived" && item.time_of_arrival ? <IconButton icon={<FaUndo />} onClick={undoArrived} colorScheme={"blue"} /> :
                            <IconButton isDisabled={item.status != "new" && item.status != "delayed"} colorScheme={"blue"} onClick={setAsArrived} icon={<FaUserCheck />} />
                        )}</Td>
                        }
                <ReasonEditModal item={item} isOpen={isOpen} onClose={onClose} />

                   {/* <Td>  <ReactToPrint
                        onAfterPrint={setAsArrived}
                        trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                        content={() => componentRef.current}/>
                        <div style={{ display: "none" }}>  <ComponentToPrint ref={componentRef} item={item} />
                        </div>
                    </Td> */}
               


            </Tr> : <Box className={next == item.tokenID ? "Blink" : ""} bg={findBg(item)} rounded="lg" p={3} m={3}>
                <HStack spacing={"auto"}>
                    <ButtonPopover settings={settings} doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} />

                    <Text color="green" fontWeight={"bold"}>{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}
                    </Text>
                    <Text fontWeight={"bold"} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}
                    </Text>
                    <Text onDoubleClick={handleDoubleClickForReason}>{types[item.type]}
                    </Text>
                    {/* <ReactToPrint
                        onAfterPrint={setAsArrived}
                        trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                        content={() => componentRef.current}
                    />
                    <div style={{ display: "none" }}>  <ComponentToPrint ref={componentRef} item={item} />
                    </div> */}
                    {user.userID == 2 && <Td>
                        {item.status == "delayed" ? <IconButton colorScheme={"blue"} icon={<FaRegFileWord />} onClick={bookWalkIn} />
                            : <IconButton isDisabled={item.status != "new" && item.status != "delayed"} colorScheme={"blue"} onClick={setAsArrived} icon={<FaUserCheck />}></IconButton>
                        }</Td>}

                    <DetailsPopover1 doctor={doctor} current={current} setCurrent={setCurrent} item={item} />

                </HStack>

                <HStack spacing="auto" height={"50"}>
                    <Text></Text>
                    <VStack spacing={0}>
                        {item.timeInEst && <Text fontWeight={"bold"}>Time</Text>}
                        <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                    <VStack spacing={0}>
                        {item.time_of_arrival && <Text fontWeight={"bold"}>Arrival</Text>}

                        <Text>{decideArrival()}
                        </Text>
                    </VStack>
                    <VStack spacing={0}>
                        {item.timeIn && <Text fontWeight={"bold"}>In</Text>}
                        <Text>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                    <VStack spacing={0}>
                        {item.timeOut && <Text fontWeight={"bold"}>Out</Text>}
                        <Text>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                    </VStack>

                </HStack>

                <ReasonEditModal item={item} isOpen={isOpen} onClose={onClose} />
                
            </Box>




    )
}