import { Button, IconButton, Td, Text, Tr, useMediaQuery, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useRef, useState } from "react"
import { FaPrint } from "react-icons/fa"
import ReactToPrint from "react-to-print"
import api from "../../api"
import { AppContext } from "../../App"
import { DiffMinutes, findBg } from "../../utils/tokenFunctions"
import { DetailsPopover } from "./DetailsPopover"
import { ButtonPopover } from "./Popover"
import { ComponentToPrint } from "./TokenPrint"

export const ListComponent = ({ isLoading, setIsLoading, current, setCurrent, doctor, item, index }) => {

    const { user } = useContext(AppContext)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])
    const [settings, setSettings] = useState([])
    const types = {
        "Review": "R",
        "First time": 'F',
        "Other": "O"
    }
    let componentRef = useRef()

    useEffect(() => {

        api.settings.fetchSettings({doctor}).then((res) => {
            const response = JSON.parse(res.data).result
            setSettings(response[0])
        })
    }, [])

    function handleDoubleClickForFile(id) {
        let fileNo = window.prompt("Enter the file number")
        if (fileNo != null) {
            //  editFileNumber(fileNo, id)
            api.token.editFileNumber({ fileNo, id }).then((res) => {
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


    function bookWalkIn() {
        api.token.bookWalkIn({ item }).then((res) => {
            window.location.reload()
        })
    }


    function setAsArrived() {
        if (!(item.time_of_arrival)) {
            console.log("hi")
            api.token.setAsArrived({ item }).then((res) => {
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
        }

        if (item.status == "delayed")
            str += "🔴"
        if (item.status == "arrived")
            str += "🟢"
        return str
    }

    return (
        <Tr key={index} bg={findBg(item)}>
            <Td><ButtonPopover settings={settings} doctor={doctor} loading={isLoading} setIsLoading={setIsLoading} current={current} setCurrent={setCurrent} item={item} /></Td>
            <Td >{item.slot.includes("W") ? `${item.initials}W-${item.tokenNumber}` : `${item.initials}-${item.tokenNumber}`}</Td>
            {isMobile && <Td>{types[item.type]}</Td>}
            <Td style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForName(item.patientID)}>{item.name}</Td>
            {isMobile && <Td>
                <VStack>
                    <DetailsPopover doctor={doctor} current={current} setCurrent={setCurrent} item={item} />
                    <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                    {/* <Text >{item.timeIn ? diffMinutes(item.timeIn, item.timeInEst) : ""} </Text> */}
                </VStack>
            </Td>}
            {isLaptop && <><Td><Text placeholder='Add file' style={{ cursor: "pointer" }} onDoubleClick={() => handleDoubleClickForFile(item.patientID)}>{item.fileNumber ? item.fileNumber : "----"}</Text>
            </Td>
                <Td> {item.type}</Td>
                <Td>{item.phone.substring(2)}</Td>
                <Td>{item.timeInEst &&
                    <VStack alignItems={"baseline"}>
                        <Text>{item.timeInEst ? new Date('1970-01-01T' + item.timeInEst + 'Z')
                            .toLocaleTimeString('en-US',
                                { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                        </Text>
                        <DiffMinutes time1={item.timeIn} time2={item.timeInEst} item={item} />
                    </VStack>}
                </Td>
                <Td >{decideArrival()}</Td>
                <Td>{item.timeIn ? new Date('1970-01-01T' + item.timeIn + 'Z')
                    .toLocaleTimeString('en-US',
                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                </Td>
                <Td>{item.timeOut ? new Date('1970-01-01T' + item.timeOut + 'Z')
                    .toLocaleTimeString('en-US',
                        { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }) : ""}
                </Td>

                <Td>  <ReactToPrint
                    onAfterPrint={setAsArrived}
                    trigger={() => <IconButton mx="1%" icon={<FaPrint />} variant={"outline"} colorScheme="teal" />}
                    content={() => componentRef.current}
                />
                    <div style={{ display: "none" }}>  <ComponentToPrint ref={componentRef} item={item} />
                    </div>
                </Td></>}

        </Tr>
    )
}