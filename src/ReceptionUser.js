
import { PatientListReception } from './Reception/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import { TokenGeneration } from './TokenGeneration';
import { PatientDetails } from './TokenGeneration/PatientDetails';
import { PatientDetailsforReview} from './ReviewBooking/PatientDetails';
import {  TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';
import { ReviewList } from './ReviewBooking/ReviewList';

function ReceptionUser() {

    console.log("reception")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientListReception />} />
        <Route path="/home" element={<PatientListReception />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<PatientDetails/>} />
        {/* <Route path="/patient-details" element={<PatientDetails />} /> */}
        <Route path="/token-details" element={<TokenDetailsChooseToken />} />
        <Route path="/book-review" element={< PatientDetailsforReview/>} />
        <Route path="/review-list" element={< ReviewList/>} />
        <Route path="/review-details" element={< TokenDetailsForReviewChooseToken/>} />
        <Route path="*" element={<PatientListReception />} />
      </Routes>
    </BrowserRouter>




  )
}

export default ReceptionUser;


