
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TokenDetailsForReviewChooseToken } from './ReviewBooking/TokenDetailsChooseToken';
import { TokenDetailsChooseToken } from './TokenGeneration/TokenDetailsChooseTokens';
import { PhysioList } from './Physio/HomePage';
import { ReviewBooking } from './ReviewBooking';
import { TokenGeneration } from './TokenGeneration';

function PhysioUser() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PhysioList />} />
                <Route path="/home" element={<PhysioList/>} />
                <Route path="/book-review" element={<ReviewBooking />} />
                <Route path="/review-details" element={< TokenDetailsForReviewChooseToken />} />
                <Route path="/book" element={<TokenGeneration />} />
                <Route path="/token-details" element={<TokenDetailsChooseToken />} />
                <Route path="*" element={<PhysioList />} />
            </Routes>
        </BrowserRouter>




    )
}

export default PhysioUser;


// all routes contained in the Unauthenticated App (routes accessible when the user is not logged in)

