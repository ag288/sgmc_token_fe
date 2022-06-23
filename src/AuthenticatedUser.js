
import { PatientList } from './Admin/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetails } from './TokenGeneration/TokenDetails';
import { PatientDetails } from './TokenGeneration/PatientDetails';
import { SendMessage } from './SendMessage';
import { PatientDetails1 } from './TokenGeneration/PatientDetails1';
import { TokenDetails1 } from './TokenGeneration/TokenDetails1';

function AuthenticatedUser() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/home" element={<PatientList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<PatientDetails1 />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/token-details" element={<TokenDetails1 />} />
        <Route path="/send-message" element={<SendMessage />} />
        <Route path="*" element={<PatientList />} />
      </Routes>
    </BrowserRouter>




  )
}

export default AuthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

