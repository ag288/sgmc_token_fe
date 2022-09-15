import React from "react";
import {
    Flex,
    Box,
    VStack,
    Stack,
    Text,
    Heading,
    Image,

} from '@chakra-ui/react';

// registration card layout

export class QRTokenPrint extends React.Component {
   

    render() {
        console.log(this.props.list)
        const colors = ["red", "navy", "teal", "green", "purple", "darkmagenta", "darkorange", "salmon", "skyblue","maroon"]
        return (
            <Flex
            p={2}
            justify="center"
            height="auto"
            width="auto"
                bg={"white"}
               >
                <VStack>
              {this.props.list?.map((item)=>
               <Box
               bg={"white"}
               width="3in"
               align="center"
               border="1px"
               mb={2}
               p={2}>
               <Heading color={colors[item?.doctorID % 10]} fontSize={"xxx-large"}>{`${item?.initials}-${item?.tokenNumber}`}</Heading>
           </Box>
              )}  
                </VStack>   
                   
              
            </Flex >
        );
    }

}
