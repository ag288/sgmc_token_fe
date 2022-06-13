
import { PatientListReception } from './Reception/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetails } from './TokenGeneration/TokenDetails';
import { PatientDetails } from './TokenGeneration/PatientDetails';

function ReceptionUser() {

    console.log("reception")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientListReception />} />
        <Route path="/home" element={<PatientListReception />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<TokenGeneration />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/token-details" element={<TokenDetails />} />
        <Route path="*" element={<PatientListReception />} />
      </Routes>
    </BrowserRouter>




  )
}

export default ReceptionUser;


