import { Flex, IconButton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FaHome } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { PatientDetails } from "../components/PatientDetails"


export const TokenGeneration = () => {

    const [availability, setAvailability] = useState("")
    let navigate = useNavigate()
    
    useEffect(() => {

        api.settings.checkAvailability().then((res) => {
            const response = JSON.parse(res.data).result
            setAvailability(response)
        })

    }, [])
    return (
        <Flex
            minH={'100vh'}
            bg={"gray.100"}>
            <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
            <PatientDetails availability={availability} navigateTo={"/token-details"} />
        </Flex>
    )
}