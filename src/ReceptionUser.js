
import { PatientListReception } from './Reception/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Settings } from './Settings';
import {  TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';
import { ReviewList } from './ReviewBooking/ReviewList';
import { TokenGeneration } from './TokenGeneration';
import { ReviewBooking } from './ReviewBooking';

function ReceptionUser() {

    console.log("reception")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientListReception />} />
        <Route path="/home" element={<PatientListReception />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<TokenGeneration/>} />
        <Route path="/token-details" element={<TokenDetailsChooseToken />} />
        <Route path="/book-review" element={< ReviewBooking/>} />
        <Route path="/review-list" element={< ReviewList/>} />
        <Route path="/review-details" element={< TokenDetailsForReviewChooseToken/>} />
        <Route path="*" element={<PatientListReception />} />
      </Routes>
    </BrowserRouter>




  )
}

export default ReceptionUser;


