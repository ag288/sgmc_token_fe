
import { PatientList } from './HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Image,
  Badge,
  useColorModeValue,
  ChakraProvider, theme, HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { FcHome } from 'react-icons/fc'
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetails } from './TokenGeneration/TokenDetails';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <PatientList /> } />
        <Route path="/home" element={<PatientList />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/book" element={<TokenGeneration/>} />
        <Route path="/pagetwo" element={<TokenDetails/>} />
        <Route path="*" element={<PatientList />} />
      </Routes>
  </BrowserRouter>

    
  

  )
}

export default App;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

   