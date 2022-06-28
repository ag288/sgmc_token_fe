
import { PatientList } from './Admin/HomePage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PatientDetailsforReview } from './ReviewBooking/PatientDetails';
import { TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken';
import { PatientDetails } from './TokenGeneration/PatientDetails';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';

function PhysioUser() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PatientDetailsforReview />} />
                <Route path="/home" element={<PatientDetailsforReview />} />
                <Route path="/book-review" element={< PatientDetailsforReview />} />
                <Route path="/review-details" element={< TokenDetailsForReviewChooseToken />} />
                <Route path="/book" element={<PatientDetails />} />
                <Route path="/token-details" element={<TokenDetailsChooseToken />} />
                <Route path="*" element={<PatientDetailsforReview />} />
            </Routes>
        </BrowserRouter>




    )
}

export default PhysioUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

