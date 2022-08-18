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

// registration card layout

export class ComponentToPrint extends React.Component {

    render() {
        const colors = ["red", "navy", "teal", "green", "purple", "darkmagenta", "darkorange", "salmon", "skyblue","maroon"]
        return (
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={"white"}
               >
                
                   
                    <Box
                        bg={"white"}
                        width='auto'
                        align="center"
                        border="1px"
                        p={2}>
                        <Heading color={colors[this.props.item.doctorID % 10]} fontSize={"xxx-large"}>{`${this.props.item.initials}-${this.props.item.tokenNumber}`}</Heading>
                    </Box>
              
            </Flex >
        );
    }

}
