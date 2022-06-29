import { Flex, HStack, IconButton } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaHome, FaList } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import api from "../api"
import userApi from "../api/user"
import { AppContext } from "../App"
import { PatientDetails } from "../components/PatientDetails"


export const ReviewBooking = () => {

    let navigate = useNavigate()

    const {user} = useContext(AppContext)
    useEffect(() => {

    }, [])

    return (
        <Flex
            minH={'100vh'}
            bg={"gray.100"}>
                <HStack spacing="auto" alignItems={"baseline"}>
            <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaHome />} onClick={() => navigate('/home')}></IconButton>
           {user.userID==2? <IconButton size="lg" bg='transparent' width="fit-content" icon={<FaList />} onClick={() => navigate('/review-list')}></IconButton>
            : null}
            </HStack>
            <PatientDetails availability={""} navigateTo={"/review-details"} />
        </Flex>
    )
}