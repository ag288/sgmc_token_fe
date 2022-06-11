
import { PatientList } from './HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetails } from './TokenGeneration/TokenDetails';
import { PatientDetails } from './TokenGeneration/PatientDetails';
import { OTPEntryField } from './TokenGeneration/VerifyOtp';

function AuthenticatedUser() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/home" element={<PatientList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<TokenGeneration />} />
        <Route path="/verify-otp" element={<OTPEntryField />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/token-details" element={<TokenDetails />} />
        <Route path="*" element={<PatientList />} />
      </Routes>
    </BrowserRouter>




  )
}

export default AuthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)
