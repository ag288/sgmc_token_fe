import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Flex,
    Stack,
    Box,
  } from '@chakra-ui/react'

  export const PatientList = () => {

  return (
    <Flex
    minH={'100vh'}
    bg={"gray.100"}>
    <Stack mx={'auto'} py={12} px={6} width={'full'}>
        <Box
            rounded={'lg'}
            bg={'white'}
            boxShadow={'lg'}
            p={8}
            width='full'>
  <TableContainer>
  <Table variant='simple'>
    <Thead>
      <Tr>
        <Th>Token No.</Th>
        <Th>Name</Th>
        <Th>File No.</Th>
        <Th>Type</Th>
        <Th>In</Th>
        <Th>Out</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>inches</Td>
        <Td>millimetres (mm)</Td>
        <Td isNumeric>25.4</Td>
        <Td>inches</Td>
        <Td>millimetres (mm)</Td>
        <Td isNumeric>25.4</Td>
      </Tr>
     </Tbody>
  </Table>
</TableContainer>
</Box>
</Stack>
</Flex>
  )

  }