import React from "react";
import {
    Flex,
    Box,
    HStack,
    Stack,
    Text,
    Heading,
    Image,

} from '@chakra-ui/react';
import { findPatientInitials } from "../../utils/tokenFunctions";

// registration card layout

export class ComponentToPrint extends React.Component {


    render() {
        const colors = ["red", "navy", "teal", "green", "purple", "darkmagenta", "darkorange", "salmon", "skyblue", "maroon"]
        return (
            <Flex
                p={2}
                justify="center"
                height="auto"
                width="auto"
                bg={"white"}
            >

                <Box
                    bg={"white"}
                    width="3in"
                    align="center"
                    border="1px"
                    p={2}>
                    <Heading color={colors[this.props.item?.doctorID % 10]} fontSize={"xxx-large"}>
                        {this.props.item?.slot.includes("W") ? `${this.props.item?.initials}W-${this.props.item?.tokenNumber}` :`${this.props.item?.initials}-${this.props.item?.tokenNumber}`}</Heading>
                    {/* <Text>{this.props.item ? `(${findPatientInitials(this.props.item)})` : ""}</Text> */}
                </Box>

            </Flex >
        );
    }

}
