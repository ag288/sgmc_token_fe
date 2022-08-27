import { useContext, useEffect, useRef, useState } from "react"
import { FaPrint } from "react-icons/fa"
import ReactToPrint from "react-to-print"
import { TokenListPrint } from "./TokenListPrint"
import { AppContext } from "../../App"
import { IconButton, MenuItem } from "@chakra-ui/react"
import api from "../../api"

export const ListPrintIcon = ({ timeOfDay }) => {
    const componentRef = useRef()
    const { doctor, doctors } = useContext(AppContext)
    const [list, setList] = useState([])
    //  const [aftlist, setAftList] = useState([])
    console.log(doctors)

    useEffect(() => {


        api.token.fetchTokenListForPrint({ doctor: doctor }).then((res) => {
            const response = JSON.parse(res.data).result

            console.log(response)
            if (timeOfDay == "Morning")
                setList(response[0])
            else
                setList(response[1])
        })



    }, [doctor]);

    return (<> <ReactToPrint
        trigger={() => <MenuItem >{`Print ${timeOfDay}`}</MenuItem>}
        content={() => componentRef.current}
    />
        <div style={{ display: "none" }}>  <TokenListPrint ref={componentRef} doctors={doctors} doctor={doctor} timeOfDay={timeOfDay} list={list} />
        </div>
    </>)
}