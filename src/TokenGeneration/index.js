import { Flex, IconButton } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaHome } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { AppContext } from "../App"
import { PatientDetails } from "../components/PatientDetails"


export const TokenGeneration = () => {

    const [availability, setAvailability] = useState("")
    const {doctor} = useContext(AppContext)
    let navigate = useNavigate()
    
    useEffect(() => {

        api.settings.checkAvailability({doctor}).then((res) => {
            const response = JSON.parse(res.data).result
            setAvailability(response)
        })

    }, [doctor])
    return (
        <Flex
            minH={'100vh'}
            bg={"gray.100"}>
            <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
            <PatientDetails availability={availability} navigateTo={"/token-details"} />
        </Flex>
    )
}