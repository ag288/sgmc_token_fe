import { useContext, useEffect, useRef, useState } from "react"
import { FaPrint } from "react-icons/fa"
import ReactToPrint from "react-to-print"
import { TokenListPrint } from "./TokenListPrint"
import { AppContext } from "../../App"
import { IconButton } from "@chakra-ui/react"
import api from "../../api"

export const ListPrintIcon = () => {
    const componentRef = useRef()
    const { doctor, doctors } = useContext(AppContext)
    const [mornlist, setMornList] = useState([])
    const [aftlist, setAftList] = useState([])
    console.log(doctors)

    useEffect(() => {


        api.token.fetchTokenListForPrint({ doctor: doctor }).then((res) => {
            const response = JSON.parse(res.data).result

            console.log(response)
            setMornList(response[0])
            setAftList(response[1])
        })



    }, [doctor]);

    return (<> <ReactToPrint
        trigger={() => <IconButton mx="1%" icon={<FaPrint />} color="white" bg="transparent" />}
        content={() => componentRef.current}
    />
        <div style={{ display: "none" }}>  <TokenListPrint ref={componentRef} doctors={doctors} doctor={doctor} aftlist={aftlist} mornlist={mornlist} />
        </div>
    </>)
}