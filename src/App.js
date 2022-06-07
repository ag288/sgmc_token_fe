
import { PatientList } from './HomePage';
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
  ChakraProvider, theme
} from '@chakra-ui/react';
import { useState } from 'react';
import { SettingsIcon } from '@chakra-ui/icons';
import {FcHome} from 'react-icons/fc'
import { Settings } from './Settings';

function App() {
  const [homepage, setHomePage] = useState(true)
  return (
    <Stack bg="gray.100"> <Box>
    <Button m="2%" onClick={()=>setHomePage(!homepage)} colorScheme={"blue"} leftIcon={!homepage? <FcHome /> : <SettingsIcon/>}>{!homepage ? "Home" : "Settings"}
    </Button> </Box>
     {homepage? <PatientList /> : <Settings/>}
    </Stack>
    
  )
}

export default App;
