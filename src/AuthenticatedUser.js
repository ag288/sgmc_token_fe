
import { PatientList } from './Admin/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';

function AuthenticatedUser() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/home" element={<PatientList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<TokenGeneration />} />
        <Route path="/token-details" element={<TokenDetailsChooseToken />} />
        <Route path="*" element={<PatientList />} />
      </Routes>
    </BrowserRouter>




  )
}

export default AuthenticatedUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

